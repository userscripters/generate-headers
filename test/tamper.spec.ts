import { expect } from "chai";
import { generate } from "../src/generate.js";
import { directCommon, grantOptionsTM, requires } from "./index.spec.js";

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

    it("@connect headers should be generated", async () => {
        const whitelist = [
            "search.google.com",
            "tampermonkey.net",
            "self",
            "localhost",
            "1.2.3.4"
        ];

        const content = await generate("tampermonkey", {
            ...directCommon,
            grants: ["fetch"],
            whitelist
        });

        whitelist.forEach((remote) => {
            const escaped = remote.replace(/([./?*()\[\]])/g, "\\$1");
            const expr = new RegExp(`@connect\\s+(${escaped})`);
            expect(expr.test(content), `failed at ${remote}`).to.be.true;
        });
    });

    it('@downloadURL header should be generated', async () => {
        const content = await generate("tampermonkey", {
            ...directCommon,
            downloadURL: requires[1]
        });

        expect(content).to.match(/@downloadURL\s+.+/);
    });
});
