"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../index.js");
const pk_ts_common_lib_1 = require("pk-ts-common-lib");
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
let testsFs = {
    tstShell: function (cmd = "ls -l", strargs = "-a", shellkey = 'git') {
        let res = (0, index_js_1.runCommand)(cmd, strargs, { shellkey });
        console.log({ res });
        (0, index_js_1.stdOut)(res);
        return res;
    },
    newData: function (sdata = "DefData", type = 'json5', fname = 'my-fname') {
        //let res = saveData("SomeData?",{fname:"WhoWhat?",type:"JSXX",dir:"yy"});
        //let res = saveData(sdata, { fname, type });
        let smObj = { dog: 7, cat: [5, 8, 0], atiger: null };
        let res = (0, index_js_1.saveData)(smObj, { fname, type: 'json' });
    },
    tstBashes: function () {
        let wbashes = (0, index_js_1.winBashes)();
        console.log({ wbashes });
        (0, index_js_1.stdOut)(wbashes);
        return wbashes;
    },
    tst: function () {
        let too = (0, pk_ts_common_lib_1.typeOf)({});
        console.log({ too });
    },
    tstSlash: function () {
        console.log("Testing path functions...");
        let somePaths = [
            "a/path/with//double/slashes",
            "/a/path/with/preceding/path",
            "/a/path/with a/ space//path",
            "./a/path/dot",
            "a/path/nodot",
            "a//path//fnameext.anext",
            "a//path/fnoext",
        ];
        for (let apath of somePaths) {
            let res = (0, index_js_1.slashPath)(apath);
            console.log({ apath, res });
        }
        console.log("Done testing path functions...");
    },
    tstMap: function () {
        let json = (0, index_js_1.sassMapStringToJson)(scssMap);
        let obj = (0, index_js_1.sassMapStringToObj)(scssMap);
        //let json = sassMapStringToJson(scssMapr);
        (0, index_js_1.dbgWrt)(json, 'sassMap');
        (0, index_js_1.dbgWrt)(obj, 'sassMapO');
        console.log({ json, obj });
    },
    tstAsk: async function () {
        //@ts-ignore
        let answer = await (0, index_js_1.ask)('What color are your eyes?', { choices: ['red', 'blue', 'green'] });
        console.log({ answer });
    },
    tstSlashOrig: async function () {
        //@ts-ignore
        let answer = (0, index_js_1.slashPath)('.');
        console.log({ answer });
    },
    tstFPaths: async function () {
        //@ts-ignore
        let answer = (0, index_js_1.getFilePaths)('.');
        console.log({ answer });
    },
};
(0, index_js_1.runCli)(testsFs);
//# sourceMappingURL=test.js.map