import { expect } from "chai";
import { generate } from "../src";
import { CommonHeaders } from "../src/generators";
import { allMatches, directCommon } from "./index.spec";

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
                expect(status !== invalid.includes(m), `failure at ${m}`).to.be
                    .true;
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

        const allSameChar = onlyMatched.every((index) => index === firstIndex);
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