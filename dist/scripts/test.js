import { dbgWrt, ask, runCli, sassMapStringToJson, sassMapStringToObj } from '../index.js';
/*
console.log("Testing lib");

const anobj = { a: "b", c: "d" };
const anarr = [1, 2, 3];
const astr = "abc";

let tob = typeOf(anobj);
let toa = typeOf(anarr);
let tos = typeOf(astr);

console.log({ tob, toa, tos });
*/
let scssMap = '(disp: (prop: display, vals: (inline: inline-block, flex: flex, vflex: (display:flex, flex-direction: column), block: block)), font: (sz: (prop: font-size, vals: (xxs: xx-small, xs: x-small, s: small, m: medium, l: large, xl: x-large, xxl: xx-large, xxxl: xxx-large)), ff: (prop: font-family, vals: (v: verdana, a: arial, c: courier, t: times)), fw: (prop: font-weight, vals: (b: bold)), fs: (prop: font-style, vals: (i: italic)), c: (prop: color, vals: (r: red, b: blue, g: green, y: yellow)), a: (prop: text-align, vals: (l: left, r: right, c: center))), bg: (prop: background, vals: (lr: #fbb, l0: #fbb, lg: #bfb, l1: #bfb, lb: #bbf, l2: #bbf, ly: #fbb, l3: #fbb, ls: #bfb, l4: #bfb, lv: #fbf, l5: #fbf, lo: #ffb, l6: #ffb, dr: #400, d0: #400, dg: #040, d1: #040, db: #004, d2: #004, dy: #440, d3: #440, ds: #444, d4: #444, dv: #404, d5: #404, do: #440, d6: #440)), border: (prop: border, vals: (lr: #fbb, l0: #fbb, lg: #bfb, l1: #bfb, lb: #bbf, l2: #bbf, ly: #fbb, l3: #fbb, ls: #bfb, l4: #bfb, lv: #fbf, l5: #fbf, lo: #ffb, l6: #ffb, dr: #400, d0: #400, dg: #040, d1: #040, db: #004, d2: #004, dy: #440, d3: #440, ds: #444, d4: #444, dv: #404, d5: #404, do: #440, d6: #440)))';
let scssMapr = '(disp: (prop: display, vals: (inline: inline-block, flex: flex, vflex: (flex, (flex-direction: column)), block: block))';
/*
    , font: (sz: (prop: font-size, vals: (xxs: xx-small, xs: x - small, s: small, m: medium, l: large, xl: x - large, xxl: xx - large, xxxl: xxx - large)), ff: (prop: font-family, vals: (v: verdana, a: arial, c: courier, t: times)), fw: (prop: font-weight, vals: (b: bold)), fs: (prop: font-style, vals: (i: italic)), c: (prop: color, vals: (r: red, b: blue, g: green, y: yellow)), a: (prop: text-align, vals: (l: left, r: right, c: center))), bg: (prop: background, vals: (lr: #fbb, l0: #fbb, lg: #bfb, l1: #bfb, lb: #bbf, l2: #bbf, ly: #fbb, l3: #fbb, ls: #bfb, l4: #bfb, lv: #fbf, l5: #fbf, lo: #ffb, l6: #ffb, dr: #400, d0: #400, dg: #040, d1: #040, db: #004, d2: #004, dy: #440, d3: #440, ds: #444, d4: #444, dv: #404, d5: #404, do: #440, d6: #440)), border: (prop: border, vals: (lr: #fbb, l0: #fbb, lg: #bfb, l1: #bfb, lb: #bbf, l2: #bbf, ly: #fbb, l3: #fbb, ls: #bfb, l4: #bfb, lv: #fbf, l5: #fbf, lo: #ffb, l6: #ffb, dr: #400, d0: #400, dg: #040, d1: #040, db: #004, d2: #004, dy: #440, d3: #440, ds: #444, d4: #444, dv: #404, d5: #404, do: #440, d6: #440))) ';
    */
let tests = {
    tstMap: function () {
        let json = sassMapStringToJson(scssMap);
        let obj = sassMapStringToObj(scssMap);
        //let json = sassMapStringToJson(scssMapr);
        dbgWrt(json, 'sassMap');
        dbgWrt(obj, 'sassMapO');
        console.log({ json, obj });
    },
    tstAsk: async function () {
        let answer = await ask('What color are your eyes?', { choices: ['red', 'blue', 'green'] });
        console.log({ answer });
    },
};
runCli(tests);
//# sourceMappingURL=test.js.map