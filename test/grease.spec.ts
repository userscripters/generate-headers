import { expect } from "chai";
import { unlink } from "fs/promises";
import { generate, type GeneratorOptions } from "../src/generate.js";
import type { GreasemonkeyGrantOptions } from "../src/generators/greasemonkey/types.js";
import { common, grantOptionsGM, grantsGM, output } from "./index.spec.js";

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
            expect(new RegExp(`\\b${grant}\\b`, "m").test(grant)).to.be.true;
        });
    });
});
