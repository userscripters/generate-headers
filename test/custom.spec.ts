import { expect } from "chai";
import { generate } from "../src/generate";
import { generateCustomHeaders } from "../src/generators/custom";
import { directCommon, managers } from "./index.spec";

describe('custom', () => {
    const custom = ["name1 value1", "name2"];

    describe(generateCustomHeaders.name, () => {
        it('should correctly generate custom headers', () => {
            const [[fname, fvalue], [sname, svalue]] = generateCustomHeaders(custom);

            expect(fname).to.equal("name1");
            expect(fvalue).to.equal("value1");
            expect(sname).to.equal("name2");
            expect(svalue).to.be.empty;
        });
    });

    describe(generate.name, () => {
        it('generate should correctly generate custom headers', async () => {
            for (const type of managers) {
                const content = await generate(type, {
                    ...directCommon,
                    custom
                });

                expect(content, type).to.match(/^\/\/ @name1\s+value1$/m);
                expect(content, type).to.match(/^\/\/ @name2\s*$/m);
            }
        });
    });
});