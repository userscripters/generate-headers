import { expect } from "chai";
import { unlink } from "fs/promises";
import { generate, type GeneratorOptions } from "../src/generate.js";
import type { CommonHeaders } from "../src/generators/index.js";
import type {
    ViolentmonkeyGrantOptions,
    ViolentmonkeyHeaders
} from "../src/generators/violentmonkey/types.js";
import { allMatches, common, grantOptionsVM, grantsVM, output, requires } from "./index.spec.js";

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
            expect(new RegExp(`\\b${grant}\\b`, "m").test(grant)).to.be.true;
        });
    });

    it("special headers should be generated", async () => {
        const vmSpecificHeaders: Exclude<
            keyof ViolentmonkeyHeaders,
            keyof CommonHeaders
            >[] = [
                "exclude-match",
                "homepageURL",
                "inject-into",
                "run-at",
                "supportURL",
                "downloadURL"
            ];

        const content = await generate("violentmonkey", {
            ...directCommon,
            downloadURL: requires[1],
            excludes: allMatches.slice(0, -1),
            homepage: requires[1]
        });

        vmSpecificHeaders.forEach((header) => {
            const status = new RegExp(`\/\/ @${header}\\s+.+?`, "gm").test(
                content
            );

            expect(status, `missing VM header: ${header}`).to.be.true;
        });
    });
});
