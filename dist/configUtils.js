/**
 * EXPERIMENTAL - EXPORT OBJS AS GLOBALS - FOR CONFIGURATIONS
 * REMEMBER - CAN'T REASSIGN
 */
//Changed in Hardlink Clone path
import { JSON5, } from 'pk-ts-common-lib';
import { fs } from './files.js';
import path from 'path';
export let defaultConfigs = {};
export let configPaths = {};
export function getAppDefaults() {
    let appDefaults = defaultConfigs.appDefaults;
    if (!appDefaults) {
        console.error("No appDefaults");
    }
    return appDefaults;
}
export function setAppDefaults(appDefaults) {
    defaultConfigs.appDefaults = appDefaults;
    return appDefaults;
}
export function getBsetpath() {
    let bsetpath = configPaths.bsetpath;
    if (!bsetpath) {
        console.error("No bsetpath defined");
    }
    return bsetpath;
}
export function setBsetpath(bsetpath) {
    configPaths.bsetpath = bsetpath;
    return bsetpath;
}
/** Gets the app settings - like where */
export function getAppConfig() {
    //console.log(`in getAppConfig - bsetpath: ${bsetpath}; __dirname: ${__dirname}`);
    let bsetpath = getBsetpath();
    if (!fs.existsSync(bsetpath)) { //Doesn't exist - create in
        let appDefaults = getAppDefaults();
        return appDefaults;
    }
    //let bsetpath = getBsetpath();
    let appConfig = require(bsetpath);
    let appDefaults = getAppDefaults() ?? {};
    appConfig = { ...appConfig, ...appDefaults };
    //console.log(`in getAppConfig - appconfig result:`, { appConfig });
    return appConfig;
}
export function setAppConfig(data) {
    let appConfig = getAppConfig();
    appConfig = { ...appConfig, ...data };
    console.log(`in setAppConfig - appconfig:`, { appConfig });
    let j5 = JSON5.stringify(appConfig);
    let bsetpath = getBsetpath();
    if (bsetpath && fs.existsSync(bsetpath)) {
        fs.writeFileSync(bsetpath, j5);
    }
    return getAppConfig();
}
export function getConfDir(configFile) {
    let appConfig = getAppConfig();
    let confDir = appConfig.configDir;
    return confDir;
}
/** Returns the named configuration from the defined configuration dir
 * @param string cfname - filename - if not ending in .json5, added
 * return - config object
 */
export function getConfig(cfname) {
    if (path.extname(cfname) !== '.json5') {
        cfname += '.json5';
    }
    let cdir = getConfDir();
    let fCpath = path.join(cdir, cfname);
    console.log({ cfname, fCpath });
    if (!fs.existsSync(fCpath)) { //Doesn't exist - create in
        console.error(`In getConfig - can't find config file: ${fCpath}`);
        return {};
    }
    let cf = require(fCpath);
    return cf;
}
export function setConfig(cfname, data) {
    if (path.extname(cfname) !== '.json5') {
        cfname += '.json5';
    }
    let cdir = getConfDir();
    let fCpath = path.join(cdir, cfname);
    let j5 = JSON5.stringify(data);
    fs.writeFileSync(fCpath, j5);
    console.log({ cfname, fCpath });
    return data;
}
export function setConfDir(confPath) {
    let update = { configDir: confPath };
    return setAppConfig(update);
}
//# sourceMappingURL=configUtils.js.map