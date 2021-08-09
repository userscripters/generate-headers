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
            const { status, invalid } = validateMatchHeaders(sampleMatches);
            expect(status).to.be.true;
            expect(invalid).to.be.empty;
        });

        it("should correctly validate invalid headers", () => {
            const typo = "http//typo.ed/*";

            const { status, invalid } = validateMatchHeaders([
                ...sampleMatches,
                typo,
            ]);
            expect(status).to.be.false;
            expect(invalid).to.contain(typo);
        });
    });
});
