import { expect } from "chai";
import { validateMatchHeaders } from "../src/utils/validators";

describe("validators", () => {
    describe("@match headers validator", () => {
        const sampleMatches: string[] = [
            "http://*/foo*",
            "https://*.google.com/foo*bar",
            "http://example.org/foo/bar.html",
            "file:///foo*",
            "http://127.0.0.1/*",
            "*://mail.google.com/*",
            "urn:*",
            "<all_urls>",
        ];

        it("should correctly validate valid headers", () => {
            const valid = validateMatchHeaders(sampleMatches);
            expect(valid).to.be.true;
        });

        it("should correctly validate invalid headers", () => {
            const valid = validateMatchHeaders([
                ...sampleMatches,
                "http//typo.ed/*",
            ]);
            expect(valid).to.be.false;
        });
    });
});
