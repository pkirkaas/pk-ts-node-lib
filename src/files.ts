import urlStatus from 'url-status-code';
import  fsPath from 'fs-path';
import path from 'path';
import util from 'util';
import _  from "lodash";
import * as ESP from "error-stack-parser";
//const axios = require("axios.js");
import axios from "axios";
import { format, isValid } from "date-fns";
import fs from  "fs-extra";
export { fs };
import os from 'os';
//const os = require("os");
import { cwd } from './index.js';
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