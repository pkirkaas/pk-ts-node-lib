const urlStatus = require('url-status-code');
const fsPath = require('fs-path');
const path = require('path');
const util = require('util');
const _ = require("lodash");
const axios = require("axios");
export const fs = require("fs-extra");
const os = require("os");
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