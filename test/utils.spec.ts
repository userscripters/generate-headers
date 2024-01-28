import { expect } from "chai";
import { appendFile, readFile, rm } from "fs/promises";
import { join } from "path";
import { replaceFileContent } from "../src/utils/filesystem";
import { explodePaths } from "../src/utils/urls";

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