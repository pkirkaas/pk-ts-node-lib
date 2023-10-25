/// <reference types="node" resolution-mode="require"/>
export declare function setInspectLevels(depth?: any, maxArrayLength?: any, breakLength?: number, colors?: boolean, maxStringLength?: any): void;
import { GenericObject, GenObj } from 'pk-ts-common-lib';
export declare const excludeFncs: string[];
export declare const fnSkips: string[];
export declare const allSkips: string[];
export declare const cwd: string;
/** Uses util.inspect to stringify an arg
 * @param object? opts - to override the default opts
 * @return string representation
 */
export declare function objInspect(arg: any, opts?: GenericObject): string;
/** Uses system os to get some os details
 * On WSL:
  arch: 'x64',
  machine: 'x86_64',
  platform: 'linux',
  release: '5.15.90.1-microsoft-standard-WSL2',
  type: 'Linux',
  version: '#1 SMP Fri Jan 27 02:56:13 UTC 2023'

  Windows:
  arch: 'x64',
  machine: 'x86_64',
  platform: 'win32',
  release: '10.0.22621',
  type: 'Windows_NT',
 *
 */
export declare function getOsDets(): {
    arch: string;
    machine: string;
    platform: NodeJS.Platform;
    release: string;
    type: string;
    version: string;
};
/**
 * Returns the OS type - 'windows' or 'linux'
 */
export declare function getOsType(): false | "linux" | "windows";
export declare function isWindows(): boolean;
export declare function isLinux(): boolean;
export declare function slashPath(...parts: any[]): string;
export declare function isDirectory(apath: any): any;
export declare function isFile(apath: any): any;
export declare function stackParse(): any[];
/** Basic info for console logging */
export declare function stamp(entry?: any, frameAfter?: any): string;
export declare function getProcess(): NodeJS.ProcessEnv;
/**
 * Starts a separate, external NODE.js script in a child process,
 * specifies to log the stdout & stderr to files in the logs dir
 * but returns immediately, without waiting for the child process to complete.
 */
export declare function asyncSpawn(cmd: string, ...params: any[]): boolean;
/**
 * If windows, returns array of all bash shells found IN WINDOWS path format
 *
 *
 */
export declare function winBashes(): false | string[];
/**
 * SYNCRONOUSLY Run a (bash) shell command in a child process, await the result & return it
 * as a string. Original from chatGPT, modified for our use.
 * @param string command - the command to run
 * @param any|any[] args - the arguments to pass to the command - flexible format by convertParamsToCliArgs
 * @param GenObj options - has keys both for this function, and to pass to pass to spawnSync
 * args - the arguments to pass to the command - flexible format by convertParamsToCliArgs
 * In particular on Windows, the shell option can be used to specify a shell to use.
 * The default is bash - but windows can have multiple bashes, so you can specify one
 * cygwin, git, bash, wsl, as well as windows shells - powershell, pwsh, cmd
 *
 */
export declare function runCommand(command: string, options?: GenObj): string | boolean;
/** Support for asyncSpawn & runCli to build valid CLI arguments from function calls
 */
export declare function convertParamsToCliArgs(params: string | string[] | GenObj | GenObj[]): any[];
/**
 * Outputs all args to stdOut, without console processing - but any arg not stringish is stringified
 */
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
/**
 * ANOTHER TRY!! Write data to a file - with better options, defaults & params....
  //function sayName({first='Bob',last='Smith'}: {first?: string; last?: string}={}){
    Writes arg data to a file - cpnfirrable with type, path, options, etc.
    @param any arg - data to write

 */
export declare function saveData(arg: any, { fname, fpath, type, dir, append }?: {
    fname?: string;
    fpath?: any;
    type?: string;
    dir?: string;
    append?: boolean;
}): any;
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