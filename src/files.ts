const urlStatus = require('url-status-code');
const fsPath = require('fs-path');
const path = require('path');
const util = require('util');
const _ = require("lodash");
import * as ESP from "error-stack-parser";
const axios = require("axios");
import { format, isValid } from "date-fns";
export const fs = require("fs-extra");
const os = require("os");
import { cwd } from '.';
//import {  OptArrStr, cwd,   bsetpath, appDefaults } from '../../init';
//import { GenericObject, OptArrStr, cwd, path, JSON5,  bsetpath, appDefaults } from '../common';
//here changing in cdc
import { GenericObject, OptArrStr,  JSON5,   } from  'pk-ts-common-lib';


/** 
 * Returns array of file paths found in the
 * paths arg, recursive
 */
export function getFilePaths(paths: OptArrStr) {
	let fpaths = [];
	if (typeof paths === 'string') {
		paths = [paths];
	}
	for (let apath of paths) {
		if (!fs.existsSync(apath)) {
			continue;
		}
		let fsStat = fs.statSync(apath);
		if (fsStat.isFile()) {
			fpaths.push(apath);
		} else if (fsStat.isDirectory()) {
			let fspRes = fsPath.findSync(apath);
			fpaths = fpaths.concat(fspRes.files);
		} else {
			throw new Error("What? Not a file or dir???");
		}
	}
	fpaths = Array.from(new Set(fpaths));
	return fpaths;
}