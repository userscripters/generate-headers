import { expect } from "chai";
import { unlink } from "fs/promises";
import { join } from "path";
import { generate } from "../src";

describe("main", () => {
  describe.skip("Greasemonkey", async () => {
    //TODO: add once other commands ready
  });

  describe("Tampermonkey", async () => {
    const artefacts: string[] = [];

    afterEach(() => Promise.all(artefacts.map(unlink)));

    const base = process.cwd();
    const testPkg = join(base, "/package.json");
    const testOut = join(base, "/test/headers.js");

    it("headers are generated correctly", async () => {
      artefacts.push(testOut);

      const content = await generate("tampermonkey", testPkg, testOut);
      expect(!!content).to.be.true;
    });

    it("header names should be equally indented", async () => {
      artefacts.push(testOut);

      const content = await generate("tampermonkey", testPkg, testOut);

      const headerMatcher = /(?<=^\/\/\s@\w+\s+)\w/;

      const valuePostions = content
        .split("\n")
        .map((line) => line.search(headerMatcher));

      const onlyMatched = valuePostions.filter((line) => line !== -1);
      const [firstIndex] = onlyMatched;

      const allSameChar = onlyMatched.every((index) => index === firstIndex);
      expect(allSameChar).to.be.true;
    });
  });

  describe.skip("ViolentMonkey", async () => {
    //TODO: add once other commands ready
  });
});
