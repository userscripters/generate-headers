import { expect, use } from "chai";
import * as cpr from "chai-as-promised";
import { exec } from "child_process";
import { readFile, stat, unlink } from "fs/promises";
import { join } from "path";
import { promisify } from "util";
import { generate, GeneratorOptions } from "../src";
import { CommonGrantOptions, CommonHeaders } from "../src/generators";
import {
    GreasemonkeyGrantOptions,
    GreasemonkeyGrants,
} from "../src/generators/greasemonkey/types";
import {
    TampermonkeyGrantOptions,
    TampermonkeyGrants,
} from "../src/generators/tampermonkey/types";
import {
    ViolentmonkeyGrantOptions,
    ViolentmonkeyGrants,
    ViolentmonkeyHeaders,
} from "../src/generators/violentmonkey/types";
import { getLongest } from "../src/utils/common";

use(cpr);

const aexec = promisify(exec);

describe("main", () => {
    const base = process.cwd();
    const pkg = join(base, "/package.json");
    const output = join(base, "/test/headers.js");
    const entry = "./src/index.ts";

    const common: GeneratorOptions<CommonGrantOptions> = {
        output,
        packagePath: pkg,
    };

    //@see https://developer.chrome.com/docs/extensions/mv2/match_patterns/
    const allMatches: string[] = [
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

    const grantsTM: TampermonkeyGrants[] = [
        "GM_getValue",
        "GM_setValue",
        "GM_deleteValue",
        "GM_listValues",
        "unsafeWindow",
        "window.close",
        "window.focus",
        "window.onurlchange",
    ];

    const grantsGM: GreasemonkeyGrants[] = [
        "GM.deleteValue",
        "GM.getValue",
        "GM.listValues",
        "GM.setValue",
        "unsafeWindow",
        "GM.setClipboard",
        "GM.xmlHttpRequest",
        "GM.notification",
    ];

    const grantsVM: ViolentmonkeyGrants[] = [
        "GM_getValue",
        "GM_setValue",
        "GM_deleteValue",
        "GM_listValues",
        "GM_download",
        "GM_notification",
        "GM_setClipboard",
        "GM_xmlhttpRequest",
        "unsafeWindow",
        "window.close",
        "window.focus",
    ];

    const grantOptionsCommon: CommonGrantOptions[] = [
        "get",
        "set",
        "list",
        "delete",
        "unsafe",
    ];

    const grantOptionsTM: TampermonkeyGrantOptions[] = [
        ...grantOptionsCommon,
        "close",
        "focus",
        "change",
    ];

    const grantOptionsGM: GreasemonkeyGrantOptions[] = [
        ...grantOptionsCommon,
        "clip",
        "fetch",
        "notify",
    ];

    const grantOptionsVM: ViolentmonkeyGrantOptions[] = [
        ...grantOptionsCommon,
        "clip",
        "fetch",
        "focus",
        "notify",
        "download",
        "style",
        "close",
    ];

    const directCommon: GeneratorOptions<TampermonkeyGrantOptions> = {
        ...common,
        direct: true,
    };

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
    });

    describe("common", () => {
        it("should skip invalid match headers", async () => {
            const invalid = ["oranges", "42!"];
            const matches = ["<all_urls>", "urn:*", ...invalid];

            const content = await generate("tampermonkey", {
                ...directCommon,
                matches,
            });

            matches
                .map((m) => m.replace(/(\*)/, "\\$1"))
                .forEach((m) => {
                    const status = new RegExp(`\\s+${m}$`, "m").test(content);
                    expect(status !== invalid.includes(m), `failure at ${m}`).to
                        .be.true;
                });
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

        it("common headers should be generated", async () => {
            const content = await generate("greasemonkey", directCommon);

            const commonHeaders: (keyof CommonHeaders)[] = [
                "author",
                "contributors",
                "description",
                "name",
                "namespace",
                "version",
            ];

            commonHeaders.forEach((header) => {
                const matcher = new RegExp(`@${header}\\s+\\w+`, "g");
                expect(matcher.test(content), `failed at ${header}`).to.be.true;
            });
        });

        it("@match headers should be generated", async () => {
            const content = await generate("violentmonkey", {
                ...directCommon,
                matches: allMatches,
            });

            const matched = content.match(/@match\s+(.+)/g) || [];
            expect(matched).length(allMatches.length);
        });
    });

    describe("Tampermonkey", async () => {
        it("headers are generated correctly", async () => {
            const content = await generate("tampermonkey", directCommon);
            expect(!!content).to.be.true;
        });

        it("@grant headers should be generated", async () => {
            const content = await generate("tampermonkey", {
                ...directCommon,
                grants: grantOptionsTM,
            });

            const matched = content.match(/@grant\s+(.+)/g) || [];
            expect(matched).length(grantOptionsTM.length);
        });
    });

    describe("Greasemonkey", async () => {
        const artefacts: string[] = [];

        const directCommon: GeneratorOptions<GreasemonkeyGrantOptions> = {
            ...common,
            direct: true,
        };

        //make sure test output will be cleared
        beforeEach(() => artefacts.push(output));

        afterEach(() => {
            Promise.all(artefacts.map(unlink));
            artefacts.length = 0;
        });

        it("headers are generated correctly", async () => {
            const content = await generate("greasemonkey", directCommon);
            expect(!!content).to.be.true;
        });

        it("@grant headers should be generated", async () => {
            const content = await generate("greasemonkey", {
                ...directCommon,
                grants: grantOptionsGM,
            });

            const matched = content.match(/@grant\s+(.+)/g) || [];
            expect(matched).length(grantOptionsGM.length);

            grantsGM.forEach((grant) => {
                expect(new RegExp(`\\b${grant}\\b`, "m").test(grant)).to.be
                    .true;
            });
        });
    });

    describe("ViolentMonkey", async () => {
        const artefacts: string[] = [];

        const directCommon: GeneratorOptions<ViolentmonkeyGrantOptions> = {
            ...common,
            direct: true,
        };

        //make sure test output will be cleared
        beforeEach(() => artefacts.push(output));

        afterEach(() => {
            Promise.all(artefacts.map(unlink));
            artefacts.length = 0;
        });

        it("headers are generated correctly", async () => {
            const content = await generate("violentmonkey", directCommon);
            expect(!!content).to.be.true;
        });

        it("@grant headers should be generated", async () => {
            const content = await generate("violentmonkey", {
                ...directCommon,
                grants: grantOptionsVM,
            });

            const matched = content.match(/@grant\s+(.+)/g) || [];
            expect(matched).length(grantOptionsVM.length);

            grantsVM.forEach((grant) => {
                expect(new RegExp(`\\b${grant}\\b`, "m").test(grant)).to.be
                    .true;
            });
        });

        it("special headers should be generated", async () => {
            const vmSpecificHeaders: Exclude<
                keyof ViolentmonkeyHeaders,
                keyof CommonHeaders
            >[] = ["homepageURL", "inject-into", "run-at", "supportURL"];

            const content = await generate("violentmonkey", directCommon);

            vmSpecificHeaders.forEach((header) => {
                const status = new RegExp(`\/\/ @${header}\\s+.+?`, "gm").test(
                    content
                );

                expect(status, `missing VM header: ${header}`).to.be.true;
            });
        });
    });
});
