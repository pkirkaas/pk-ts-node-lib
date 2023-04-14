import fsPath from 'fs-path';
import fs from "fs-extra";
export { fs };
import { slashPath } from './index.js';
/** THIS ASSUMES WE ARE IN A MODULE SYSTEM
 * Replaces __dirname & __filename
 */
import { fileURLToPath } from 'url';
import { dirname } from 'path';
export function getFilename(url, ...parts) {
    let urlPath = fileURLToPath(url);
    let fpath = slashPath(urlPath, ...parts);
    //return slashPath(fileURLToPath(url));
    return fpath;
}
export function getDirname(url, ...parts) {
    let fpath = getFilename(url, ...parts);
    return slashPath(dirname(fpath));
}
/**
 * Returns array of file paths found in the
 * paths arg, recursive
 */
export function getFilePaths(paths) {
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
        }
        else if (fsStat.isDirectory()) {
            let fspRes = fsPath.findSync(apath);
            fpaths = fpaths.concat(fspRes.files);
        }
        else {
            throw new Error("What? Not a file or dir???");
        }
    }
    fpaths = Array.from(new Set(fpaths));
    return fpaths;
}
