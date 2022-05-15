import { expect } from "chai";
import { exec } from "child_process";
import { readFile, stat, unlink } from "fs/promises";
import { promisify } from "util";
import { TampermonkeyGrants } from "../src/generators/tampermonkey/types.js";
import { getLongest } from "../src/utils/common.js";
import {
    allMatches,
    grantOptionsTM,
    grantsTM,
    grantsVM,
    output,
    pkg,
    requires
} from "./index.spec.js";

const aexec = promisify(exec);

describe("CLI Options", function () {
    this.timeout(30e3); // CLI runs can be slow

    const entry = "./src/cli.ts";
    const cliPfx = `node --loader ts-node/esm ${entry}`;

    afterEach(async () =>
        stat(output)
            .then(() => unlink(output))
            .catch(() => {})
    );

    /**
     * CLI runs are grouped before test cases to achieve some level
     * of parallelization for CLI tests (each can take up to 5s)
     */
    const cliRuns: { stdout: string; stderr: string; }[] = [];

    before(async () => {
        const runs = await Promise.all([
            aexec(`${cliPfx} tampermonkey -p ${pkg} -d --du ${requires[1]} -u ${requires[1]} -n testing -h ${requires[1]} --nf`),
            aexec(`${cliPfx} violentmonkey -i "content" -p ${pkg} -o ${output} -d`),
            aexec(`${cliPfx} tampermonkey -i "page" -p ${pkg} -o ${output} -d`),
            aexec(`${cliPfx} tampermonkey -p ${pkg} -o ${output} -d`),
            aexec(`${cliPfx} violentmonkey -p ${pkg} -o ${output} -d -g all`),
            aexec(`${cliPfx} tampermonkey -m all -c -d`),
            aexec(`${cliPfx} tampermonkey -p ${pkg} -d --pretty`),
        ]);

        cliRuns.push(...runs);
    });

    it("-d option should forgo file generation", async () => {
        const { stdout } = cliRuns[0];
        expect(!!stdout).to.be.true;
        expect(stat(output)).to.eventually.be.rejected;
    });

    it("-d option should override -o", async () => {
        await aexec(`${cliPfx} tampermonkey -p ${pkg} -o ${output} -d`);
        expect(stat(output)).to.eventually.be.rejected;
    });

    it('-h option should override @homepage header', () => {
        const { stdout } = cliRuns[0];
        expect(stdout).to.match(new RegExp(`^\\/\\/ @homepage\\s+${requires[1]}$`, "m"));
    });

    it('--du option should add @downloadURL header', async () => {
        const { stdout } = cliRuns[0];
        expect(stdout).to.match(new RegExp(`^\\/\\/ @downloadURL\\s+${requires[1]}$`, "m"));
    });

    it('-n option should override @namespace header', () => {
        const { stdout } = cliRuns[0];
        expect(stdout).to.match(new RegExp(`^\\/\\/ @namespace\\s+testing$`, "m"));
    });

    it('--nf option should add @noframes header', () => {
        const { stdout } = cliRuns[0];
        expect(stdout).to.match(new RegExp(`^\\/\\/ @noframes`, "m"));
    });

    it('-u option should add @updateURL for Tampermonkey', () => {
        const { stdout } = cliRuns[0];
        expect(stdout).to.match(new RegExp(`^\\/\\/ @updateURL\\s+${requires[1]}$`, "m"));
    });

    it("-i option should add inject-into header for Violentmonkey", () => {
        const { stdout } = cliRuns[1];
        expect(stdout).to.match(/^\/\/ @inject-into\s+content$/gm);
    });

    it("-i option should result in no-op for non-Violentmonkey managers", () => {
        const { stdout } = cliRuns[2];
        expect(stdout).to.not.match(/^\/\/ @inject-into\s+page$/gm);
    });

    it("-g options should correctly add @grant", async () => {
        const gOpts = grantOptionsTM.map((g) => `-g "${g}"`).join(" ");

        const { stdout } = await aexec(
            `${cliPfx} tampermonkey ${gOpts} -p ${pkg} -o ${output} -d`
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

    it('no -g options should add @grant "none"', () => {
        const { stdout } = cliRuns[3];
        const isNone = /@grant\s+none/.test(stdout);
        expect(isNone).to.be.true;
    });

    it("-g option set to 'all' should include all possible grants", () => {
        const { stdout } = cliRuns[4];

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
            `${cliPfx} tampermonkey ${mOpts} -p ${pkg} -o ${output} -d`
        );

        const matched = stdout.match(/@match\s+(.+)/g) || [];
        expect(matched).length(allMatches.length);
    });

    it("-x options should correctly add @exclude", async () => {
        // without <all_urls>
        const xs = allMatches.slice(0, -1).map((x) => `-x "${x}"`).join(" ");

        const { stdout } = await aexec(`${cliPfx} tampermonkey ${xs} -p ${pkg} -o ${output} -d`);

        const matched = stdout.match(/@exclude\s+(.+)/g) || [];
        expect(matched).length(allMatches.length - 1);
    });

    it("-x options should correctly add @exclude-match headers for Violentmonkey", async () => {
        // without <all_urls>
        const xs = allMatches.slice(0, -1).map((x) => `-x "${x}"`).join(" ");

        const { stdout } = await aexec(`${cliPfx} violentmonkey ${xs} -p ${pkg} -o ${output} -d`);

        const matched = stdout.match(/@exclude-match\s+(.+)/g) || [];
        expect(matched).length(allMatches.length - 1);
    });

    it('-q options should correctly add @require', async () => {
        const rOpts = requires.map((m) => `-q "${m}"`).join(" ");

        const { stdout } = await aexec(
            `${cliPfx} tampermonkey ${rOpts} -p ${pkg} -o ${output} -d`
        );

        const required = stdout.match(/@require\s+(.+)/g) || [];
        expect(required).length(2);
    });

    it("-c option should correctly collapse -m all [template] output", async () => {
        const { stdout } = cliRuns[5];
        expect(stdout).to.match(/\*\.stackexchange\.com/);
    });

    it("-r option should correctly add @run-at", async function () {
        this.timeout(1e4);

        const opts = `-p ${pkg} -o ${output} -d`;

        const [{ stdout: tmout }, { stdout: vmout }, { stdout: gmout }] =
            await Promise.all([
                aexec(`${cliPfx} tampermonkey ${opts} --run menu`),
                aexec(`${cliPfx} violentmonkey ${opts} -r end`),
                aexec(`${cliPfx} greasemonkey ${opts} -r idle`),
            ]);

        expect(tmout).to.match(/^\/\/ @run-at\s+context-menu$/gm);
        expect(vmout).to.match(/^\/\/ @run-at\s+document-end$/gm);
        expect(gmout).to.match(/^\/\/ @run-at\s+document-idle$/gm);
    });

    it("-s option should control number of spaces added", async () => {
        const sp = 8;

        await aexec(`${cliPfx} tampermonkey -s ${sp} -p ${pkg} -o ${output}`);

        const contents = await readFile(output, { encoding: "utf-8" });

        const lines = contents.split("\n");

        const matches = lines
            .map((line) => line.match(/(\/\/ @\w+)\s+/) || [])
            .filter(({ length }) => length);

        const headers = matches.map(([, header]) => header);
        const headlines = matches.map(({ input }) => input);

        const longest = getLongest(headers);

        const [firstHeader] = headlines;

        const index = firstHeader?.search(/(?<=^\/\/\s@\w+\s+)\w/);
        expect(longest + sp + 1).to.be.equal(index);
    });

    it("--pretty option should format headers correctly", async () => {
        const { stdout } = cliRuns[6];
        const [, name] = /\/\/ @name\s+(.+)$/m.exec(stdout) || [];
        expect(name).to.be.equal("Generate Headers");
    });
});
