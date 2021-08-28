import { expect } from "chai";
import { unlink } from "fs/promises";
import { generate, GeneratorOptions } from "../src";
import { CommonHeaders } from "../src/generators";
import {
    ViolentmonkeyGrantOptions,
    ViolentmonkeyHeaders,
} from "../src/generators/violentmonkey/types";
import { common, grantOptionsVM, grantsVM, output } from "./index.spec";

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