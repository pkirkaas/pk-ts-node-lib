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
//const os = require("os");
import { cwd } from './index.js';
//import {  OptArrStr, cwd,   bsetpath, appDefaults } from '../../init';
//import { GenericObject, OptArrStr, cwd, path, JSON5,  bsetpath, appDefaults } from '../common';
//here changing in cdc
import { GenericObject, OptArrStr, JSON5, PkError, } from 'pk-ts-common-lib';
import { slashPath, isDirectory, } from './index.js';

/** THIS ASSUMES WE ARE IN A MODULE SYSTEM
 * Replaces __dirname & __filename
 * TODO: Investigate further - like - what is 'import.meta.url'?
 */
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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
	vid: [
		".webm", ".mkv", ".flv", ".vob", ".ogv", ".ogg", ".rrc", ".gifv", ".mng",
		".mov", ".avi", ".qt", ".wmv", ".yuv", ".rm", ".asf", ".amv", ".mp4", ".m4p",
		".m4v", ".mpg", ".mp2", ".mts", ".mpeg", ".mpe", ".mpv", ".m4v", ".svi", ".3gp",
		".3g2", ".mxf", ".roq", ".nsv", ".flv", ".f4v", ".f4p", ".f4a", ".f4b", ".mod",
	],
	img: [
		'.jpg', '.jpeg', '.jpe', '.jif', '.jfif', '.jfi', '.png', '.gif', '.webp', '.tiff',
	],
};

/**
 * Returns flat array of file paths found in the folder, recursive
 * @param folder - path to folder
 * @param type - optional file type to filter on -
 *   a key to extTypes, or ext string
 *   if empty, all files
 * @return array of file paths
 */
export async function getFiles(folder, type?: string) {
	if (!isDirectory(folder)) {
		throw new PkError(`Folder not found: ${folder}`);
	}

	//  const contents = await readdir(path, { withFileTypes: true });
	const filesInPath = await fs.readdir(folder, { withFileTypes: true });

	let files = (await Promise.all(filesInPath.map((fileInPath) => {
		const resolvedPath = slashPath(path.resolve(folder, fileInPath.name));
		return fileInPath.isDirectory() ? getFiles(resolvedPath) : resolvedPath;
	}))).flat(99);

	if (type) {
		let extArr = [];
		if (type in extTypes) {
			extArr = extTypes[type];
		} else {
			extArr = [type];
		}
		files = files.filter(file => extArr.includes(path.extname(file).toLowerCase()));
	}
	return files;
}