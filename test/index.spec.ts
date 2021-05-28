import { expect } from "chai";
import { exec } from "child_process";
import { readFile, unlink } from "fs/promises";
import { join } from "path";
import { promisify } from "util";
import { generate } from "../src";
import { getLongest } from "../src/utils";

const aexec = promisify(exec);

describe("main", () => {
  const base = process.cwd();
  const pkg = join(base, "/package.json");
  const out = join(base, "/test/headers.js");
  const entry = "./src/index.ts";

  describe.skip("Greasemonkey", async () => {
    //TODO: add once other commands ready
  });

  describe("CLI Options", async () => {
    it("-s option should control number of spaces added", async function () {
      this.timeout(5e3);

      const sp = 8;

      await aexec(`ts-node ${entry} tampermonkey -s ${sp} -p ${pkg} -o ${out}`);
      const contents = await readFile(out, { encoding: "utf-8" });

      const lines = contents.split("\n");

      const matches = lines
        .map((line) => line.match(/(\/\/ @\w+)\s+/) || [])
        .filter(({ length }) => length);

      const headers = matches.map(([, header]) => header);
      const headlines = matches.map(({ input }) => input);

      const longest = getLongest(headers);

      const [fistHeader] = headlines;

      const index = fistHeader!.search(/(?<=^\/\/\s@\w+\s+)\w/);
      expect(longest + sp + 1).to.be.equal(index);
    });
  });

  describe("Tampermonkey", async () => {
    const artefacts: string[] = [];

    afterEach(() => {
      Promise.all(artefacts.map(unlink));
      artefacts.length = 0;
    });

    it("headers are generated correctly", async () => {
      artefacts.push(out);

      const content = await generate("tampermonkey", pkg, out);
      expect(!!content).to.be.true;
    });

    it("header names should be equally indented", async () => {
      artefacts.push(out);

      const content = await generate("tampermonkey", pkg, out);

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
