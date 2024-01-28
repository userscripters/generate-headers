import { expect } from "chai";
import { appendFile, rm } from "fs/promises";
import { join } from "path";
import { makeMonkeyTags } from "../src/generators/common/monkey";
import { getPackage } from "../src/utils/package";
import {
    getExistingHeadersOffset,
    validateConnectHeaders, validateExcludeHeaders, validateMatchHeaders,
    validateOptionalHeaders,
    validateRequiredHeaders
} from "../src/utils/validators";
import { allMatches, requires } from "./index.spec";

describe("Validators", () => {
    const base = process.cwd();
    const pkg = join(base, "/package.json");

    describe(validateMatchHeaders.name, () => {
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

    describe(validateExcludeHeaders.name, () => {
        // without <all_urls>
        const allExcludes = allMatches.slice(0, -1);

        it("should correctly validate valid headers", () => {
            const { status, invalid } = validateExcludeHeaders(allExcludes);
            expect(status).to.be.true;
            expect(invalid).to.be.empty;
        });

        it("should correctly validate invalid headers", () => {
            const typo = "http//typo.ed/*";

            const { status, invalid } = validateExcludeHeaders([
                ...allExcludes,
                typo,
            ]);

            expect(status).to.be.false;
            expect(invalid).to.contain(typo);
        });
    });

    describe(validateConnectHeaders.name, () => {
        const sampleRemotes: string[] = [
            "tampermonkey.net",
            "support.google.com",
            "localhost",
            "self",
            "*"
        ];

        it("should correctly validate valid headers", () => {
            const { status, invalid } = validateConnectHeaders(sampleRemotes);
            expect(status).to.be.true;
            expect(invalid).to.be.empty;
        });

        it("should correctly validate invalid headers", () => {
            const invalidIpV4 = "999.88.20.400";
            const invalidDomain = "https://test.com/path";

            const { status, invalid } = validateConnectHeaders([
                ...sampleRemotes,
                invalidIpV4,
                invalidDomain
            ]);

            expect(status).to.be.false;
            expect(invalid).to.contain(invalidIpV4);
            expect(invalid).to.contain(invalidDomain);
        });
    });

    describe(validateRequiredHeaders.name, () => {
        it("should correctly validate package with required fields present", async () => {
            const validPackage = await getPackage(pkg);

            const { status, missing } = validateRequiredHeaders(validPackage!);

            expect(status).to.be.true;
            expect(missing).to.be.empty;
        });

        it("should correctly validate package with required fields absent", async () => {
            const validPackage = await getPackage(pkg);

            const testInvalid = { ...validPackage };
            delete testInvalid.author;
            delete testInvalid.name;
            delete testInvalid.description;

            //@ts-expect-error
            testInvalid.version = "gobblygook5.0";
            testInvalid.homepage = "alice in wonderland";

            const { status, missing, isValidVersion, isValidHomepage } =
                //@ts-expect-error
                validateRequiredHeaders(testInvalid);

            expect(status).to.be.false;
            expect(isValidVersion).to.be.false;
            expect(isValidHomepage).to.be.false;
            expect(missing).to.contain("author");
            expect(missing).to.contain("name");
            expect(missing).to.contain("description");
        });
    });

    describe(validateOptionalHeaders.name, () => {
        it('should correctly valide @downloadURL', () => {
            // file:// URLs are not valid for download
            requires.slice(1).forEach((url) => {
                const { isValidDownloadURL } = validateOptionalHeaders({ downloadURL: url });
                expect(isValidDownloadURL, `${url}`).to.be.true;
            });
        });
    });

    describe(getExistingHeadersOffset.name, () => {
        const [openTag, closeTag] = makeMonkeyTags();

        it("should return the correct position of existing headers", async () => {
            const { EOL } = await import("os");

            const tmpfile = join("./", "headers.js");

            const content = `${openTag}${EOL}just a header${EOL}${closeTag}${EOL}`;

            await appendFile(tmpfile, content, { encoding: 'utf-8' });

            const [start, end] = await getExistingHeadersOffset(tmpfile);

            await rm(tmpfile);

            expect(start).to.equal(0);
            expect(end).to.equal(Buffer.from(content).length - EOL.length);
        });

    });
});