import fsPath from 'fs-path';
import fs from "fs-extra";
export { fs };
import { slashPath } from './index.js';
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
export function getFilename(url, ...parts) {
    let urlPath = fileURLToPath(url);
    let fpath = slashPath(urlPath, ...parts);
    //return slashPath(fileURLToPath(url));
    return fpath;
}
/** As above, ONLY for ESM replacing __dirname
 * const __dirname = getDirname(import.meta.url);
 */
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
//# sourceMappingURL=files.js.map