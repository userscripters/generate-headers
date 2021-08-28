import { expect } from "chai";
import { generate } from "../src";
import { directCommon, grantOptionsTM } from "./index.spec";

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
