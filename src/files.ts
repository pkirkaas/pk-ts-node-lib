/**
 * Node File  System functions/utilities
 */

// NPM Imports
import urlStatus from 'url-status-code';
import fsPath from 'fs-path';
import path from 'path';
import util from 'util';
import _ from "lodash";
import * as ESP from "error-stack-parser";
//const axios = require("axios.js");
import axios from "axios";
import { format, isValid } from "date-fns";
import fs from "fs-extra";
export { fs };
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// PK Lib Imports
//import {  OptArrStr, cwd,   bsetpath, appDefaults } from '../../init';
//import { GenericObject, OptArrStr, cwd, path, JSON5,  bsetpath, appDefaults } from '../common';
//here changing in cdc

import { GenericObject, GenObj, uniqueVals, Strings, mkArray, OptArrStr, JSON5, PkError, } from 'pk-ts-common-lib';

// Local Imports
import { cwd } from './index.js';
import { slashPath, isDirectory, } from './index.js';

/** THIS ASSUMES WE ARE IN A MODULE SYSTEM
 * Replaces __dirname & __filename
 * TODO: Investigate further - like - what is 'import.meta.url'?
 */

/**
 * Returns the full filename/path of the calling module/file -
 * Awkwardly replaces __filename - BUT calling module has to call with:
 * let __filename = getFilename(import.meta.url)
 * 
 * 
 * CONSIDER - creating a function that creates a function from a string with th Function constructor, or 
 */
export function getFilename(url: string, ...parts): string {
	let urlPath = fileURLToPath(url);
	let fpath = slashPath(urlPath, ...parts);
	//return slashPath(fileURLToPath(url));
	return fpath;
}

/** As above, ONLY for ESM replacing __dirname
 * const __dirname = getDirname(import.meta.url);
 */
export function getDirname(url: string, ...parts): string {
	let fpath = getFilename(url, ...parts);
	return slashPath(dirname(fpath));
}


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

export const extTypes = { // Extensions for file types
	vid: [ //Video formats
		".webm", ".mkv", ".flv", ".vob", ".ogv", ".ogg", ".rrc", ".gifv", ".mng",
		".mov", ".avi", ".qt", ".wmv", ".yuv", ".rm", ".asf", ".amv", ".mp4", ".m4p",
		".m4v", ".mpg", ".mp2", ".mts", ".mpeg", ".mpe", ".mpv", ".m4v", ".svi", ".3gp",
		".3g2", ".mxf", ".roq", ".nsv", ".flv", ".f4v", ".f4p", ".f4a", ".f4b", ".mod",
	],
	img: [ //Image formats
		'.jpg', '.jpeg', '.jpe', '.jif', '.jfif', '.jfi', '.png', '.gif', '.webp', '.tiff',
		'.jbf', '.psd', '.bmp', '.svg', '.raw', '.pcd',
	],
	aud: [ //Audio formats
		'.aac', '.aif', '.cda', '.mid', '.midi', '.mp3', '.mpa', '.ogg', '.wav', '.wma', '.wpl',

	],
};

/**
 * Returns flat array of file paths found in the folder, recursive
 * @param folder:string - path to folder
 * @param types?:string|string[] - optional white list file type to filter on -
 *   a key to extTypes, or ext string
 *   if empty, all files
 * @return array of file paths
 */
export async function getFiles(folder:string, types?: Strings):Promise<string[]> {
	if (!isDirectory(folder)) {
		throw new PkError(`Folder not found: ${folder}`);
	}

	//  const contents = await readdir(path, { withFileTypes: true });
	const filesInPath = await fs.readdir(folder, { withFileTypes: true });

	let files = (await Promise.all(filesInPath.map((fileInPath) => {
		const resolvedPath = slashPath(path.resolve(folder, fileInPath.name));
		return fileInPath.isDirectory() ? getFiles(resolvedPath) : resolvedPath;
	}))).flat(99);

	if (types) {
		let incTypes: string[] = mkArray(types);
		let extArr = [];
		for (let type of incTypes) {

			if (type in extTypes) {
				extArr = extArr.concat(extTypes[type]);
			} else {
				extArr = extArr.concat([type]);
			}
		}
		extArr = extArr.map(ext => {
			return (ext.startsWith('.') ? ext : '.' + ext).toLowerCase();;
		});
		extArr = uniqueVals(extArr);
		files = files.filter(file => extArr.includes(path.extname(file).toLowerCase()));
	}
	return files;
}

/**
 * Returns SET of all extensions in a folder, testing getFiles w. types
 * @param folder:string - path to folder
 * @param types?:string|string[] - optional white list file type to filter on -
 *   a key to extTypes, or ext string
 *   if empty, all files
 * @return array of file extensions found
 */
export async function getAllExts(folder:string, types?: Strings):Promise<string[]> {
	let files = await getFiles(folder, types);
	let exts = files.map(file => path.extname(file).toLowerCase());
	let uexts = Array.from(new Set(exts));
	return uexts;
}