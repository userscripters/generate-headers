import { expect } from "chai";
import { appendFile, readFile, rm } from "fs/promises";
import { join } from "path";
import { makeMonkeyTags } from "../src/generators/common/monkey.js";
import { replaceFileContent } from "../src/utils/filesystem.js";
import { getPackage } from "../src/utils/package.js";
import { explodePaths } from "../src/utils/urls.js";
import {
    getExistingHeadersOffset,
    validateConnectHeaders, validateExcludeHeaders, validateMatchHeaders,
    validateOptionalHeaders,
    validateRequiredHeaders
} from "../src/utils/validators.js";
import { allMatches, requires } from "./index.spec.js";

describe("validators", () => {
    const base = process.cwd();
    const pkg = join(base, "/package.json");

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

    describe("@connect headers validator", () => {
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

    describe("required package headers validator", () => {
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

    describe("existing headers checker", () => {
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

describe("filesystem", () => {

    describe("file content replacer", () => {

        it("should correctly replace content", async () => {
            const tmpfile = join("./", "test.txt");

            await appendFile(tmpfile, "0123456789", { encoding: "utf-8" });

            await replaceFileContent(tmpfile, 0, 4, "----");

            const content = await readFile(tmpfile, { encoding: "utf-8" });

            await rm(tmpfile);

            expect(content.startsWith("----")).to.be.true;
        });

    });

});

describe('urls', () => {
    describe(explodePaths.name, () => {
        it('should return one URL string for non-explodable paths', () => {
            const url = "https://google.com/search*";
            const paths = explodePaths(url);
            expect(paths.length).to.equal(1);
            expect(paths[0]).to.equal(url);
        });

        it('should return a URL string for each alternation of explodable paths', () => {
            const url = "http://stackoverflow.com/questions|review/*";
            const paths = explodePaths(url);
            expect(paths.length).to.equal(2);

            const [questions, reviews] = paths;
            expect(questions).to.contain("/questions/*");
            expect(reviews).to.contain("/review/*");
        });
    });
});