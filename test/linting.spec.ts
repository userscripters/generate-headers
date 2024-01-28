import { lintHeaders } from "../src/linters/index";

import { generate } from "../src/generate";

import { expect } from "chai";
import { managers, output, pkg } from "./index.spec";

describe(lintHeaders.name, () => {
    it("should return empty 'error' and same 'output' on no errors", async () => {
        for (const manager of managers) {
            const input = await generate(manager, {
                collapse: true,
                output,
                packagePath: pkg,
            });

            const { error, headers } = await lintHeaders(input, { spaces: 4 });

            expect(error).to.be.empty;
            expect(headers).to.equal(input);
        }
    });

    it("should return empty 'error' and fixed 'output' on errors and 'fix' enabled", async () => {
        const input = await generate("tampermonkey", {
            collapse: true,
            output,
            packagePath: pkg,
        });

        const { error, headers } = await lintHeaders(input, { spaces: 2, fix: true });

        expect(error).to.be.empty;
        expect(headers).to.not.equal(input);
    });

    it("should return filled 'error' and same 'output' on errors and 'fix' disabled", async () => {
        const input = await generate("tampermonkey", {
            collapse: true,
            output,
            packagePath: pkg,
        });

        const { error, headers } = await lintHeaders(input, { spaces: 2 });

        expect(error).to.include("userscripts/align-attributes");
        expect(headers).to.equal(input);
    });

    it("should require homepageURL if the manager supports it", async () => {
        const input = await generate("tampermonkey", {
            collapse: true,
            output,
            packagePath: pkg,
        });

        const { error } = await lintHeaders(input, { spaces: 4, isHomepageAllowed: true });

        expect(error).to.include("userscripts/use-homepage-and-url");
    });
});