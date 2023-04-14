"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setConfDir = exports.setConfig = exports.getConfig = exports.getConfDir = exports.setAppConfig = exports.getAppConfig = exports.setBsetpath = exports.getBsetpath = exports.setAppDefaults = exports.getAppDefaults = exports.configPaths = exports.defaultConfigs = void 0;
/**
 * EXPERIMENTAL - EXPORT OBJS AS GLOBALS - FOR CONFIGURATIONS
 * REMEMBER - CAN'T REASSIGN
 */
//Changed in Hardlink Clone path
const pk_ts_common_lib_1 = require("pk-ts-common-lib");
const files_js_1 = require("./files.js");
const path_1 = __importDefault(require("path"));
exports.defaultConfigs = {};
exports.configPaths = {};
function getAppDefaults() {
    let appDefaults = exports.defaultConfigs.appDefaults;
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
    let bsetpath = exports.configPaths.bsetpath;
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
    let bsetpath = getBsetpath();
    if (!files_js_1.fs.existsSync(bsetpath)) { //Doesn't exist - create in
        let appDefaults = getAppDefaults();
        return appDefaults;
    }
    //let bsetpath = getBsetpath();
    let appConfig = require(bsetpath);
    let appDefaults = (_a = getAppDefaults()) !== null && _a !== void 0 ? _a : {};
    appConfig = Object.assign(Object.assign({}, appConfig), appDefaults);
    //console.log(`in getAppConfig - appconfig result:`, { appConfig });
    return appConfig;
}
exports.getAppConfig = getAppConfig;
function setAppConfig(data) {
    let appConfig = getAppConfig();
    appConfig = Object.assign(Object.assign({}, appConfig), data);
    console.log(`in setAppConfig - appconfig:`, { appConfig });
    let j5 = pk_ts_common_lib_1.JSON5.stringify(appConfig);
    let bsetpath = getBsetpath();
    if (bsetpath && files_js_1.fs.existsSync(bsetpath)) {
        files_js_1.fs.writeFileSync(bsetpath, j5);
    }
    return getAppConfig();
}
exports.setAppConfig = setAppConfig;
function getConfDir(configFile) {
    let appConfig = getAppConfig();
    let confDir = appConfig.configDir;
    return confDir;
}
exports.getConfDir = getConfDir;
/** Returns the named configuration from the defined configuration dir
 * @param string cfname - filename - if not ending in .json5, added
 * return - config object
 */
function getConfig(cfname) {
    if (path_1.default.extname(cfname) !== '.json5') {
        cfname += '.json5';
    }
    let cdir = getConfDir();
    let fCpath = path_1.default.join(cdir, cfname);
    console.log({ cfname, fCpath });
    if (!files_js_1.fs.existsSync(fCpath)) { //Doesn't exist - create in
        console.error(`In getConfig - can't find config file: ${fCpath}`);
        return {};
    }
    let cf = require(fCpath);
    return cf;
}
exports.getConfig = getConfig;
function setConfig(cfname, data) {
    if (path_1.default.extname(cfname) !== '.json5') {
        cfname += '.json5';
    }
    let cdir = getConfDir();
    let fCpath = path_1.default.join(cdir, cfname);
    let j5 = pk_ts_common_lib_1.JSON5.stringify(data);
    files_js_1.fs.writeFileSync(fCpath, j5);
    console.log({ cfname, fCpath });
    return data;
}
exports.setConfig = setConfig;
function setConfDir(confPath) {
    let update = { configDir: confPath };
    return setAppConfig(update);
}
exports.setConfDir = setConfDir;
//# sourceMappingURL=configUtils.js.map