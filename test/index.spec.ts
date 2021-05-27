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

    it("headers are generated correctly", async () => {
      const base = process.cwd();
      const testPkg = join(base, "/package.json");
      const testOut = join(base, "/test/headers.js");

      artefacts.push(testOut);

      const content = await generate("tampermonkey", testPkg, testOut);
      expect(!!content).to.be.true;
    });
  });

  describe.skip("ViolentMonkey", async () => {
    //TODO: add once other commands ready
  });
});
