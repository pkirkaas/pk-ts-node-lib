"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.setConfDir = exports.setConfig = exports.getConfig = exports.getConfDir = exports.setAppConfig = exports.getAppConfig = exports.setBsetpath = exports.getBsetpath = exports.setAppDefaults = exports.getAppDefaults = exports.configPaths = exports.defaultConfigs = void 0;
/**
 * EXPERIMENTAL - EXPORT OBJS AS GLOBALS - FOR CONFIGURATIONS
 * REMEMBER - CAN'T REASSIGN
 */
//Changed in Hardlink Clone path
var pk_ts_common_lib_1 = require("pk-ts-common-lib");
var files_1 = require("./files");
var path = require('path');
exports.defaultConfigs = {};
exports.configPaths = {};
function getAppDefaults() {
    var appDefaults = exports.defaultConfigs.appDefaults;
    if (!appDefaults) {
        console.error("No appDefaults");
    }
    return appDefaults;
}
exports.getAppDefaults = getAppDefaults;
function setAppDefaults(appDefaults) {
    exports.defaultConfigs.appDefaults = appDefaults;
    return appDefaults;
}
exports.setAppDefaults = setAppDefaults;
function getBsetpath() {
    var bsetpath = exports.configPaths.bsetpath;
    if (!bsetpath) {
        console.error("No bsetpath defined");
    }
    return bsetpath;
}
exports.getBsetpath = getBsetpath;
function setBsetpath(bsetpath) {
    exports.configPaths.bsetpath = bsetpath;
    return bsetpath;
}
exports.setBsetpath = setBsetpath;
/** Gets the app settings - like where */
function getAppConfig() {
    var _a;
    //console.log(`in getAppConfig - bsetpath: ${bsetpath}; __dirname: ${__dirname}`);
    var bsetpath = getBsetpath();
    if (!files_1.fs.existsSync(bsetpath)) { //Doesn't exist - create in
        var appDefaults_1 = getAppDefaults();
        return appDefaults_1;
    }
    //let bsetpath = getBsetpath();
    var appConfig = require(bsetpath);
    var appDefaults = (_a = getAppDefaults()) !== null && _a !== void 0 ? _a : {};
    appConfig = __assign(__assign({}, appConfig), appDefaults);
    //console.log(`in getAppConfig - appconfig result:`, { appConfig });
    return appConfig;
}
exports.getAppConfig = getAppConfig;
function setAppConfig(data) {
    var appConfig = getAppConfig();
    appConfig = __assign(__assign({}, appConfig), data);
    console.log("in setAppConfig - appconfig:", { appConfig: appConfig });
    var j5 = pk_ts_common_lib_1.JSON5.stringify(appConfig);
    var bsetpath = getBsetpath();
    if (bsetpath && files_1.fs.existsSync(bsetpath)) {
        files_1.fs.writeFileSync(bsetpath, j5);
    }
    return getAppConfig();
}
exports.setAppConfig = setAppConfig;
function getConfDir(configFile) {
    var appConfig = getAppConfig();
    var confDir = appConfig.configDir;
    return confDir;
}
exports.getConfDir = getConfDir;
/** Returns the named configuration from the defined configuration dir
 * @param string cfname - filename - if not ending in .json5, added
 * return - config object
 */
function getConfig(cfname) {
    if (path.extname(cfname) !== '.json5') {
        cfname += '.json5';
    }
    var cdir = getConfDir();
    var fCpath = path.join(cdir, cfname);
    console.log({ cfname: cfname, fCpath: fCpath });
    if (!files_1.fs.existsSync(fCpath)) { //Doesn't exist - create in
        console.error("In getConfig - can't find config file: ".concat(fCpath));
        return {};
    }
    var cf = require(fCpath);
    return cf;
}
exports.getConfig = getConfig;
function setConfig(cfname, data) {
    if (path.extname(cfname) !== '.json5') {
        cfname += '.json5';
    }
    var cdir = getConfDir();
    var fCpath = path.join(cdir, cfname);
    var j5 = pk_ts_common_lib_1.JSON5.stringify(data);
    files_1.fs.writeFileSync(fCpath, j5);
    console.log({ cfname: cfname, fCpath: fCpath });
    return data;
}
exports.setConfig = setConfig;
function setConfDir(confPath) {
    var update = { configDir: confPath };
    return setAppConfig(update);
}
exports.setConfDir = setConfDir;
