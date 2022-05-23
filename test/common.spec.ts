import { expect } from "chai";
import sinon from "sinon";
import { generate } from "../src/generate.js";
import type { CommonHeaders } from "../src/generators/common/index.js";
import { generateMatchHeaders } from "../src/generators/index.js";
import { prettifyName } from "../src/utils/name.js";
import type { scrapeNetworkSites } from "../src/utils/scraper.js";
import { allMatches, directCommon, managers, requires } from "./index.spec.js";

describe("common", () => {

    before(() => sinon.stub(console, "log"));

    after(() => sinon.restore());

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

        const commonValuedHeaders: (keyof CommonHeaders)[] = [
            "author",
            "contributors",
            "description",
            "name",
            "namespace",
            "version",
        ];

        const commonNameOnlyHeaders: Array<keyof CommonHeaders> = [
            "noframes"
        ];

        commonValuedHeaders.forEach((header) => {
            const matcher = new RegExp(`@${header}\\s+\\w+`, "g");
            expect(matcher.test(content), `failed at ${header}`).to.be.true;
        });

        commonNameOnlyHeaders.forEach((header) => {
            const matcher = new RegExp(`@${header}`, "g");
            expect(matcher.test(content), `failed at ${header}`).to.be.true;
        });
    });

    it('@name header should always be the first one', async () => {
        for (const type of managers) {
            const content = await generate(type, directCommon);
            const [, name] = content.split(/\r?\n/);
            expect(name).to.match(/^\/\/ @name\s+/m);
        }
    });

    it('@exclude headers should be generated', async () => {
        const allExcludes = allMatches.slice(0, -1);

        const content = await generate("greasemonkey", {
            ...directCommon,
            excludes: allExcludes
        });

        const matched = content.match(/@exclude\s+(.+)/g) || [];
        expect(matched).length(allExcludes.length);
    });

    it("@match headers should be generated", async () => {
        const content = await generate("violentmonkey", {
            ...directCommon,
            matches: allMatches,
        });

        const matched = content.match(/@match\s+(.+)/g) || [];
        expect(matched).length(allMatches.length);
    });

    it('"match" with "all" should expand to all sites', async () => {
        const headers = await generateMatchHeaders(
            ["all", "https://domain"],
            (async () => [
                { site: "stackoverflow.com" },
                { site: "cooking.stackexchange.com" },
                { site: "meta.stackexchange.com" },
            ]) as typeof scrapeNetworkSites
        );

        const matches = headers.map(([, m]) => m);
        expect(matches).to.include("https://*.stackexchange.com");
        expect(matches).length.to.be.greaterThan(1);
    });

    it('@require headers should be generated', async () => {
        const content = await generate("tampermonkey", {
            ...directCommon,
            requires
        });

        const required = content.match(/@require\s+(.+)/g) || [];

        // 'file:' protocol URLs are filtered out
        expect(required.length).to.equal(2);
    });

    it('"namespace" option should override package.json scope', async () => {
        const content = await generate("tampermonkey", {
            ...directCommon,
            namespace: "testing"
        });

        expect(content).to.match(/@namespace\s+testing$/m);
    });

    it('"pretty" option should prettify output', async () => {
        const content = await generate("tampermonkey", {
            ...directCommon,
            pretty: true,
        });

        const [, packageName] = process.env["npm_package_name"]!.split("/");
        const [, formattedName] = content.match(/@name\s+(.+)/) || [];

        expect(prettifyName(packageName)).to.equal(formattedName);
    });
});
