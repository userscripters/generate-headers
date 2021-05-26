/**
 * @fileoverview default source file
 */

const main = () => Promise.resolve('Hello world!');

(async () => {
    const hello = await main();
    console.log(hello);
})();