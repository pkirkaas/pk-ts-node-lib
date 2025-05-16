/**
 * Cribbed from old version of is-invalid-path 1.0
 * Very rough test for invalid characters in a file path.
 */
/**
 * Checks if a string is an invalid file system path.
 *
 * Detects:
 * - Empty strings or non-strings
 * - Glob patterns (using is-glob), but allows square brackets in filenames
 * - Invalid characters for cross-platform file paths
 * - Allows Windows drive letters (e.g., C:/, D:/)
 *
 * @param str The string to check
 * @returns true if the path is invalid, false if it's valid
 */
export declare function invalidPath(str: string): boolean;
export declare function setInspectLevels(depth?: any, maxArrayLength?: any, breakLength?: number, colors?: boolean, maxStringLength?: any, getters?: boolean): void;
import { GenericObject, GenObj } from 'pk-ts-common-lib';
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
/**
 * Converts a string into a valid filename for both Windows and Linux systems.
 *
 * Rules implemented:
 * - Removes/replaces invalid characters
 * - Handles Windows reserved names
 * - Prevents leading/trailing spaces and dots
 * - Enforces maximum length
 * - Handles empty or invalid inputs
 *
 * @param {string} str - The input string to convert to a valid filename
 * @param {string} [rep='_'] - The replacement character for invalid characters
 * @returns {string} A valid filename string
 * @throws {TypeError} If input parameters are invalid
 */
export declare function safeFile(str: string, rep?: string): string;
export declare function isDirectory(apath: any): any;
export declare function isFile(apath: any): any;
/**
 * Ensure a directory exists for a path
 */
export declare function mkDirForPath(fpath: string): string;
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
export declare function dbgPath(fname?: string): string;
/** Change argument order to make path optional*/
export declare function dbgWrt(arg: any, fname?: string, append?: boolean): string;
/**
 * Write data to a file
 * @param arg:any - data to write - if not a string, it will be stringified
 * @param fpath:string - filename or directory path -
 *   if a directory, will write to a file "{fpath}/debug-out.json5"
 *   if a filename/path, will write to the path.
 *     If no extension, will add ".json5" or ".log" depending on the type of arg
 * @param append:boolean - Append or overwrite?
 * @return string - the path written to
 */
export declare function writeData(arg: any, fpath: string, append?: boolean): string;
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
/** File based msg logging - when no db...
 * @param any msg - gotta have something...
 * @param string? lpath: some path to the log file,
 * or we make a best guess
 * @return ???
 */
export declare function logMsg(msg: any, lpath?: string): string | false;
/** Call from a catch - logs error to file, console.error, & returns false
 */
export declare function catchErr(err: any, ...rest: any[]): boolean;
export declare function loadJson(afile: any): any;
//# sourceMappingURL=node-operations.d.ts.map