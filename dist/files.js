"use strict";
exports.__esModule = true;
exports.getFilePaths = exports.fs = void 0;
var urlStatus = require('url-status-code');
var fsPath = require('fs-path');
var path = require('path');
var util = require('util');
var _ = require("lodash");
var axios = require("axios");
exports.fs = require("fs-extra");
var os = require("os");
/**
 * Returns array of file paths found in the
 * paths arg, recursive
 */
function getFilePaths(paths) {
    var fpaths = [];
    if (typeof paths === 'string') {
        paths = [paths];
    }
    for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
        var apath = paths_1[_i];
        if (!exports.fs.existsSync(apath)) {
            continue;
        }
        var fsStat = exports.fs.statSync(apath);
        if (fsStat.isFile()) {
            fpaths.push(apath);
        }
        else if (fsStat.isDirectory()) {
            var fspRes = fsPath.findSync(apath);
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
