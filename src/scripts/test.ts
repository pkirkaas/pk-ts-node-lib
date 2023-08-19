import {
	getFilePaths, slashPath, dbgWrt, ask, runCli, sassMapStringToJson, sassMapStringToObj, saveData, isFile, getOsType, isWindows, isLinux, runCommand, stdOut, winBashes
} from '../index.js';

import { isEmpty, typeOf } from 'pk-ts-common-lib';
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
		let res = runCommand(cmd, strargs, { shellkey });
		console.log({ res });
		stdOut(res);
		return res;
	},
	newData: function (sdata = "DefData", type = 'json5', fname = 'my-fname') {
		//let res = saveData("SomeData?",{fname:"WhoWhat?",type:"JSXX",dir:"yy"});
		//let res = saveData(sdata, { fname, type });
		let smObj = { dog: 7, cat: [5, 8, 0], atiger: null };
		let res = saveData(smObj, { fname, type: 'json' });
	},
	tstBashes: function () {
		let wbashes = winBashes();
		console.log({ wbashes });
		stdOut(wbashes);
		return wbashes;
	},
	tst: function () {
		let too = typeOf({});
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
			let res = slashPath(apath);
			console.log({ apath, res });
		}
		console.log("Done testing path functions...");

	},



	tstMap: function () {
		let json = sassMapStringToJson(scssMap);
		let obj = sassMapStringToObj(scssMap);
		//let json = sassMapStringToJson(scssMapr);
		dbgWrt(json, 'sassMap');
		dbgWrt(obj, 'sassMapO');
		console.log({ json, obj });
	},

	tstAsk: async function () {
		//@ts-ignore
		let answer = await ask('What color are your eyes?', { choices: ['red', 'blue', 'green'] });
		console.log({ answer });
	},
	
	tstSlashOrig: async function () {
		//@ts-ignore
		let answer = slashPath('.');
		console.log({ answer });
	},
	tstFPaths: async function () {
		//@ts-ignore
		let answer = getFilePaths('.');
		console.log({ answer });
	},
};

runCli(testsFs);