/**
 * Library of JS/TS functions specifically for Node.js - extends 'pk-ts-common-lib' functions
 * that are pure JS & not browser/node dependent
 * @author Paul Kirkaas
 * @email pkirkaas@gmail.com
 *
 */
/// <reference types="node" resolution-mode="require"/>
export declare function setInspectLevels(depth?: any, maxArrayLength?: any, breakLength?: number, colors?: boolean, maxStringLength?: any): void;
import { GenericObject } from 'pk-ts-common-lib';
export declare const excludeFncs: string[];
export declare const fnSkips: string[];
export declare const allSkips: string[];
export declare const cwd: string;
/** Uses util.inspect to stringify an arg
 * @param object? opts - to override the default opts
 * @return string representation
 */
export declare function objInspect(arg: any, opts?: GenericObject): string;
export declare function slashPath(...parts: any[]): string;
export declare function isDirectory(apath: any): any;
export declare function stackParse(): any[];
/** Basic info for console logging */
export declare function stamp(entry?: any, frameAfter?: any): string;
export declare function getProcess(): NodeJS.ProcessEnv;
export declare function asyncSpawn(cmd: string, ...params: any[]): boolean;
/** Support for asyncSpawn & runCli to build valid CLI arguments from function calls
 */
export declare function convertParamsToCliArgs(params: any): any[];
export declare function stdOut(...args: any[]): void;
export declare function utilInspect(obj: any, opts?: any): string;
export declare function dbgPath(fname: any): string;
/** Change argument order to make path optional*/
export declare function dbgWrt(arg: any, fpath?: string, append?: boolean): any;
export declare function dbgWrite(fpath: any, arg: any, append?: boolean): any;
export declare function compareArrays(arr1: [], arr2: []): {
    arr1: [];
    arr2: [];
    arr1Cnt: 0;
    arr2Cnt: 0;
    shared: any[];
    sharedCnt: number;
    onlyArr1: any[];
    onlyArr1Cnt: number;
    onlyArr2: any[];
    onlyArr2Cnt: number;
};
/**
 * Better param order for writeFile
 */
export declare function writeData(arg: any, fpath?: string, append?: boolean): any;
export declare function writeFile(fpath: any, arg: any, append?: boolean): any;
export declare function getFrameAfterFunction(fname?: any, forceFunction?: any): any;
/** File based msg logging - when no db...
 * @param any msg - gotta have something...
 * @param string? lpath: some path to the log file,
 * or we make a best guess
 * @return ???
 */
export declare function logMsg(msg: any, lpath?: string): any;
/** Call from a catch - logs error to file, console.error, & returns false
 */
export declare function catchErr(err: any, ...rest: any[]): boolean;
export declare function loadJson(afile: any): any;
//# sourceMappingURL=node-operations.d.ts.map