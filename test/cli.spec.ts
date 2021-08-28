import { expect } from "chai";
import { exec } from "child_process";
import { readFile, stat, unlink } from "fs/promises";
import { promisify } from "util";
import { TampermonkeyGrants } from "../src/generators/tampermonkey/types";
import { getLongest } from "../src/utils/common";
import {
    allMatches,
    grantOptionsTM,
    grantsTM,
    grantsVM,
    output,
    pkg,
} from "./index.spec";

const aexec = promisify(exec);

describe("CLI Options", async function () {
    this.timeout(5e3);

    const entry = "./src/index.ts";

    afterEach(async () =>
        stat(output)
            .then(() => unlink(output))
            .catch(() => {})
    );

    it("-d option should forgo file generation", async () => {
        const { stdout } = await aexec(
            `ts-node ${entry} tampermonkey -p ${pkg} -d`
        );
        expect(!!stdout).to.be.true;
        expect(stat(output)).to.eventually.be.rejected;
    });

    it("-d option should override -o", async () => {
        await aexec(`ts-node ${entry} tampermonkey -p ${pkg} -o ${output} -d`);
        expect(stat(output)).to.eventually.be.rejected;
    });

    it("-i option should add inject-into header for Violentmonkey", async () => {
        const { stdout } = await aexec(
            `ts-node ${entry} violentmonkey -i "content" -p ${pkg} -o ${output} -d`
        );
        expect(stdout).to.match(/^\/\/ @inject-into\s+content$/gm);
    });

    it("-i option should result in no-op for non-Violentmonkey managers", async () => {
        const { stdout } = await aexec(
            `ts-node ${entry} tampermonkey -i "page" -p ${pkg} -o ${output} -d`
        );
        expect(stdout).to.not.match(/^\/\/ @inject-into\s+page$/gm);
    });

    it("-g options should correctly add @grant", async () => {
        const gOpts = grantOptionsTM.map((g) => `-g "${g}"`).join(" ");

        const { stdout } = await aexec(
            `ts-node ${entry} tampermonkey ${gOpts} -p ${pkg} -o ${output} -d`
        );

        const matched = stdout.match(/@grant\s+(.+)/g) || [];
        expect(matched).length(grantOptionsTM.length);

        const allAreTampermonkeyHeaders = matched.every((grant) =>
            grantsTM.includes(
                grant.replace(/@grant\s+/, "") as TampermonkeyGrants
            )
        );

        expect(allAreTampermonkeyHeaders).to.be.true;
    });

    it('no -g options should add @grant "none"', async () => {
        const { stdout } = await aexec(
            `ts-node ${entry} tampermonkey -p ${pkg} -o ${output} -d`
        );

        const isNone = /@grant\s+none/.test(stdout);
        expect(isNone).to.be.true;
    });

    it("-g option set to 'all' should include all possible grants", async () => {
        const { stdout } = await aexec(
            `ts-node ${entry} violentmonkey -p ${pkg} -o ${output} -d -g all`
        );

        grantsVM.forEach((grant) => {
            const status = new RegExp(`^// @grant\\s+${grant}$`, "gm").test(
                stdout
            );
            expect(status, `missing ${grant} grant`).to.be.true;
        });
    });

    it("-m options should correctly add @matches", async () => {
        const mOpts = allMatches.map((m) => `-m "${m}"`).join(" ");

        const { stdout } = await aexec(
            `ts-node ${entry} tampermonkey ${mOpts} -p ${pkg} -o ${output} -d`
        );

        const matched = stdout.match(/@match\s+(.+)/g) || [];
        expect(matched).length(allMatches.length);
    });

    it("-r option should correctly add @run-at", async function () {
        this.timeout(1e4);

        const command = `ts-node ${entry}`;
        const opts = `-p ${pkg} -o ${output} -d`;

        const [{ stdout: tmout }, { stdout: vmout }, { stdout: gmout }] =
            await Promise.all([
                aexec(`${command} tampermonkey ${opts} --run menu`),
                aexec(`${command} violentmonkey ${opts} -r end`),
                aexec(`${command} greasemonkey ${opts} -r idle`),
            ]);

        expect(tmout).to.match(/^\/\/ @run-at\s+context-menu$/gm);
        expect(vmout).to.match(/^\/\/ @run-at\s+document-end$/gm);
        expect(gmout).to.match(/^\/\/ @run-at\s+document-idle$/gm);
    });

    it("-s option should control number of spaces added", async () => {
        const sp = 8;

        await aexec(
            `ts-node ${entry} tampermonkey -s ${sp} -p ${pkg} -o ${output}`
        );
        const contents = await readFile(output, { encoding: "utf-8" });

        const lines = contents.split("\n");

        const matches = lines
            .map((line) => line.match(/(\/\/ @\w+)\s+/) || [])
            .filter(({ length }) => length);

        const headers = matches.map(([, header]) => header);
        const headlines = matches.map(({ input }) => input);

        const longest = getLongest(headers);

        const [fistHeader] = headlines;

        const index = fistHeader!.search(/(?<=^\/\/\s@\w+\s+)\w/);
        expect(longest + sp + 1).to.be.equal(index);
    });

    it("--pretty option should format headers correctly", async () => {
        const { stdout } = await aexec(
            `ts-node ${entry} tampermonkey -p ${pkg} -d --pretty`
        );

        const [, name] = /\/\/ @name\s+(.+)$/m.exec(stdout) || [];
        expect(name).to.be.equal("Generate Headers");
    });
});