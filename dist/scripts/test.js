"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
console.log("Testing lib");
const anobj = { a: "b", c: "d" };
const anarr = [1, 2, 3];
const astr = "abc";
let tob = (0, __1.typeOf)(anobj);
let toa = (0, __1.typeOf)(anarr);
let tos = (0, __1.typeOf)(astr);
console.log({ tob, toa, tos });
//# sourceMappingURL=test.js.map