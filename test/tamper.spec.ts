import { expect } from "chai";
import { generate } from "../src/generate";
import type { CommonHeaders } from "../src/generators/common/index";
import type { TampermonkeyHeaders } from "../src/generators/tampermonkey/types";
import { directCommon, grantOptionsTM, requires } from "./index.spec";

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

    it("special headers should be generated", async () => {
        const tmSpecificHeaders: Exclude<
            keyof TampermonkeyHeaders,
            keyof CommonHeaders
            >[] = ["downloadURL", "homepage", "updateURL"];

        const content = await generate("tampermonkey", {
            ...directCommon,
            downloadURL: requires[1],
            homepage: requires[1],
            updateURL: requires[1]
        });

        tmSpecificHeaders.forEach((header) => {
            const status = new RegExp(`\/\/ @${header}\\s+.+?`, "gm").test(
                content
            );

            expect(status, `missing VM header: ${header}`).to.be.true;
        });
    });
});
