import fsPath from 'fs-path';
import fs from "fs-extra";
export { fs };
import { slashPath } from './index.js';
/** THIS ASSUMES WE ARE IN A MODULE SYSTEM
 * Replaces __dirname & __filename
 */
import { fileURLToPath } from 'url';
import { dirname } from 'path';
export function getFilename() {
    return slashPath(fileURLToPath(import.meta.url));
}
export function getDirname() {
    return slashPath(dirname(fileURLToPath(import.meta.url)));
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