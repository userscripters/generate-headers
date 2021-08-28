"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mdLink = exports.scase = exports.getLongest = void 0;
const getLongest = (words) => Math.max(...words.map(({ length }) => length));
exports.getLongest = getLongest;
const scase = (text) => `${text[0].toUpperCase()}${text.slice(1).toLowerCase()}`;
exports.scase = scase;
const mdLink = (lbl, href) => `[${lbl}](${href})`;
exports.mdLink = mdLink;
