import { expect } from "chai";
import { appendFile, readFile, rm } from "fs/promises";
import { join } from "path";
import { makeMonkeyTags } from "../src/generators/common/monkey";
import { replaceFileContent } from "../src/utils/filesystem";
import { getPackage } from "../src/utils/package";
import {
    getExistingHeadersOffset,
    validateMatchHeaders,
    validateRequiredHeaders
} from "../src/utils/validators";

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