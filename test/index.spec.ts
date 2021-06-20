import { expect, use } from "chai";
import * as cpr from "chai-as-promised";
import { exec } from "child_process";
import { readFile, stat, unlink } from "fs/promises";
import { join } from "path";
import { promisify } from "util";
import { generate, GeneratorOptions } from "../src";
import { getLongest } from "../src/utils";

use(cpr);

const aexec = promisify(exec);

describe("main", () => {
    const base = process.cwd();
    const pkg = join(base, "/package.json");
    const output = join(base, "/test/headers.js");
    const entry = "./src/index.ts";

    const common: GeneratorOptions = { output, packagePath: pkg };

    describe.skip("Greasemonkey", async () => {
        //TODO: add once other commands ready
    });

    describe("CLI Options", async function () {
        this.timeout(5e3);

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
            await aexec(
                `ts-node ${entry} tampermonkey -p ${pkg} -o ${output} -d`
            );
            expect(stat(output)).to.eventually.be.rejected;
        });

        it("-m options should correctly add @matches", async () => {
            //@see https://developer.chrome.com/docs/extensions/mv2/match_patterns/
            const matches: string[] = [
                "http://*/*",
                "http://*/foo*",
                "https://*.google.com/foo*bar",
                "http://example.org/foo/bar.html",
                "file:///foo*",
                "http://127.0.0.1/*",
                "*://mail.google.com/*",
                "urn:*",
                "<all_urls>",
            ];

            const mOpts = matches.map((m) => `-m "${m}"`).join(" ");

            const { stdout } = await aexec(
                `ts-node ${entry} tampermonkey ${mOpts} -p ${pkg} -o ${output} -d`
            );

            const matched = stdout.match(/@matches\s+(.+)/g) || [];
            expect(matched).length(9);
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
    });

    describe("Tampermonkey", async () => {
        const artefacts: string[] = [];

        const directCommon: GeneratorOptions = { ...common, direct: true };

        //make sure test output will be cleared
        beforeEach(() => artefacts.push(output));

        afterEach(() => {
            Promise.all(artefacts.map(unlink));
            artefacts.length = 0;
        });

        it("headers are generated correctly", async () => {
            const content = await generate("tampermonkey", directCommon);
            expect(!!content).to.be.true;
        });

        it("@matches headers should be generated", async () => {
            //@see https://developer.chrome.com/docs/extensions/mv2/match_patterns/
            const matches: string[] = [
                "http://*/*",
                "http://*/foo*",
                "https://*.google.com/foo*bar",
                "http://example.org/foo/bar.html",
                "file:///foo*",
                "http://127.0.0.1/*",
                "*://mail.google.com/*",
                "urn:*",
                "<all_urls>",
            ];

            const content = await generate("tampermonkey", {
                ...directCommon,
                matches,
            });

            const matched = content.match(/@matches\s+(.+)/g) || [];
            expect(matched).length(9);
        });

        it("header names should be equally indented", async () => {
            const content = await generate("tampermonkey", directCommon);

            const headerMatcher = /(?<=^\/\/\s@\w+\s+)\w/;

            const valuePostions = content
                .split("\n")
                .map((line) => line.search(headerMatcher));

            const onlyMatched = valuePostions.filter((line) => line !== -1);
            const [firstIndex] = onlyMatched;

            const allSameChar = onlyMatched.every(
                (index) => index === firstIndex
            );
            expect(allSameChar).to.be.true;
        });
    });

    describe.skip("ViolentMonkey", async () => {
        //TODO: add once other commands ready
    });
});
