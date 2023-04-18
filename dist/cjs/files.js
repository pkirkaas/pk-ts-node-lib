"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilePaths = exports.getDirname = exports.getFilename = exports.fs = void 0;
const fs_path_1 = __importDefault(require("fs-path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
exports.fs = fs_extra_1.default;
const index_js_1 = require("./index.js");
/** THIS ASSUMES WE ARE IN A MODULE SYSTEM
 * Replaces __dirname & __filename
 */
const url_1 = require("url");
const path_1 = require("path");
function getFilename(url, ...parts) {
    let urlPath = (0, url_1.fileURLToPath)(url);
    let fpath = (0, index_js_1.slashPath)(urlPath, ...parts);
    //return slashPath(fileURLToPath(url));
    return fpath;
}
exports.getFilename = getFilename;
function getDirname(url, ...parts) {
    let fpath = getFilename(url, ...parts);
    return (0, index_js_1.slashPath)((0, path_1.dirname)(fpath));
}
exports.getDirname = getDirname;
/**
 * Returns array of file paths found in the
 * paths arg, recursive
 */
function getFilePaths(paths) {
    let fpaths = [];
    if (typeof paths === 'string') {
        paths = [paths];
    }
    for (let apath of paths) {
        if (!fs_extra_1.default.existsSync(apath)) {
            continue;
        }
        let fsStat = fs_extra_1.default.statSync(apath);
        if (fsStat.isFile()) {
            fpaths.push(apath);
        }
        else if (fsStat.isDirectory()) {
            let fspRes = fs_path_1.default.findSync(apath);
            fpaths = fpaths.concat(fspRes.files);
        }
        else {
            throw new Error("What? Not a file or dir???");
        }
    }
    fpaths = Array.from(new Set(fpaths));
    return fpaths;
}
exports.getFilePaths = getFilePaths;
//# sourceMappingURL=files.js.map