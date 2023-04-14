/**
 * EXPERIMENTAL - EXPORT OBJS AS GLOBALS - FOR CONFIGURATIONS
 * REMEMBER - CAN'T REASSIGN
 */
import { GenericObject } from 'pk-ts-common-lib';
export declare let defaultConfigs: GenericObject;
export declare let configPaths: GenericObject;
export declare function getAppDefaults(): any;
export declare function setAppDefaults(appDefaults: any): any;
export declare function getBsetpath(): any;
export declare function setBsetpath(bsetpath: any): any;
/** Gets the app settings - like where */
export declare function getAppConfig(): any;
export declare function setAppConfig(data?: any): any;
export declare function getConfDir(configFile?: string): any;
/** Returns the named configuration from the defined configuration dir
 * @param string cfname - filename - if not ending in .json5, added
 * return - config object
 */
export declare function getConfig(cfname: string): any;
export declare function setConfig(cfname: string, data: GenericObject): GenericObject;
export declare function setConfDir(confPath: string): any;
//# sourceMappingURL=configUtils.d.ts.map