/**
 * Library of JS/TS functions specifically for Node.js - extends 'pk-ts-common-lib' functions
 * that are pure JS & not browser/node dependent
 * @author Paul Kirkaas
 * @email pkirkaas@gmail.com
 *
 */
import fs from "fs-extra";
//export const  path =  require( 'path');
import path from 'path';
import util from 'util';
export function setInspectLevels(depth = null, maxArrayLength = null, breakLength = 200, colors = true, maxStringLength = null) {
    util.inspect.defaultOptions.maxArrayLength = maxArrayLength;
    util.inspect.defaultOptions.depth = depth;
    util.inspect.defaultOptions.colors = colors;
    util.inspect.defaultOptions.maxStringLength = maxStringLength;
    util.inspect.defaultOptions.breakLength = breakLength;
}
util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.depth = null;
util.inspect.defaultOptions.breakLength = 200;
import os from "os";
import { spawn, spawnSync } from "child_process";
import * as ESP from "error-stack-parser";
import { format } from "date-fns";
import { JSON5Parse, isEmpty, isSimpleType, isSimpleObject, JSON5Stringify, isPrimitive, inArr1NinArr2, intersect, arrayToLower } from 'pk-ts-common-lib';
export const excludeFncs = [
    "errLog", "baseLog", "getFrameAfterFunction", "getFrameAfterFunction2", "consoleLog", "consoleError",
    "infoLog", "debugLog", "stamp", "fulfilled", "rejected", "processTicksAndRejections", "LogData.log",
    "LogData.out", "LogData.console", "LogData.errLog", "LogData.throw", 'catchErr', 'logMsg',
];
//let fnSkips = ["__awaiter", "Object.<anonymous>", "undefined", undefined];
export const fnSkips = ["__awaiter", "undefined", undefined];
export const allSkips = fnSkips.concat(excludeFncs);
export const cwd = slashPath(process.cwd());
/** Uses util.inspect to stringify an arg
 * @param object? opts - to override the default opts
 * @return string representation
 */
export function objInspect(arg, opts) {
    let defOpts = {
        showHidden: true,
        maxArrayLength: null,
        maxStringLength: null,
        depth: null,
        showProxy: true,
        getters: true,
    };
    if (opts && typeof opts === 'object') {
        Object.assign(defOpts, opts);
    }
    return util.inspect(arg, defOpts);
}
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
export function getOsDets() {
    let res = {
        arch: os.arch(),
        machine: os.machine(),
        platform: os.platform(),
        release: os.release(),
        type: os.type(),
        version: os.version(),
    };
    return res;
}
/**
 * Returns the OS type - 'windows' or 'linux'
 */
export function getOsType() {
    let dets = getOsDets();
    let vals = arrayToLower(Object.values(dets));
    if (vals.includes('linux')) {
        return 'linux';
    }
    let winTypes = arrayToLower(['Windows_NT', 'win32']);
    let common = intersect(vals, winTypes);
    if (common.length) {
        return 'windows';
    }
    return false;
}
export function isWindows() {
    return getOsType() === 'windows';
}
export function isLinux() {
    return getOsType() === 'linux';
}
//Moded to combine path.join & slashPath - should be compatible
// What about spaces???
export function slashPath(...parts) {
    let apath = path.join(...parts);
    return apath.split(path.sep).join(path.posix.sep);
}
export function isDirectory(apath) {
    return fs.existsSync(apath) && fs.lstatSync(apath).isDirectory();
}
export function isFile(apath) {
    return fs.existsSync(apath) && fs.lstatSync(apath).isFile();
}
export function stackParse() {
    let stack = ESP.parse(new Error());
    let ret = [];
    for (let info of stack) {
        let res = {
            fileName: path.basename(info.fileName),
            lineNumber: info.lineNumber,
            functionName: info.functionName,
        };
        ret.push(res);
    }
    return ret;
}
/** Basic info for console logging */
export function stamp(entry, frameAfter) {
    let entId = "";
    //console.log({ entry });
    if (!isEmpty(entry) && typeof entry === "object") {
        if (entry.id) {
            entId = entry.id;
        }
    }
    let frame = getFrameAfterFunction(frameAfter, true);
    //let frame = getFrameAfterFunction2(frameAfter, true);
    //let frame = getFrameAfterFunction(frameAfter, true);
    let src = "";
    if (frame) {
        src = `:${path.basename(frame.fileName)}:${frame.functionName}:${frame.lineNumber}:`;
        //console.log({ frame });
    }
    let now = new Date();
    let pe = process.env.PROCESS_ENV;
    // TODO!! Just broke updating to latest version of date-fns - 19 Dec 2023
    //@ts-ignore
    let ds = format(now, "y-LL-dd H:m:s");
    return `${ds}-${pe}${src}: ${entId} `;
}
export function getProcess() {
    console.log(process.env);
    return process.env;
}
/**
 * Starts a separate, external NODE.js script in a child process,
 * specifies to log the stdout & stderr to files in the logs dir
 * but returns immediately, without waiting for the child process to complete.
 */
export function asyncSpawn(cmd, ...params) {
    try {
        let args = convertParamsToCliArgs(params);
        let cwd = process.cwd();
        let logDir = path.join(cwd, "logs");
        let stdLog = path.join(logDir, `${cmd}-stdout.log`);
        let errLog = path.join(logDir, `${cmd}-stderr.log`);
        fs.mkdirSync(logDir, { recursive: true });
        let stdOut = fs.openSync(stdLog, "a");
        let stdErr = fs.openSync(errLog, "a");
        let script = path.join(cwd, "dist", "src", `scripts`, `async-jobs.js`);
        if (!fs.existsSync(script)) {
            console.error(`asyncSpawn couldn't find the script: ${script}`);
            return false;
        }
        args.unshift(cmd);
        args.unshift(script);
        console.log({ __dirname, cwd, cmd, script, args });
        const subprocess = spawn("node", args, {
            cwd,
            detached: true,
            stdio: ["ignore", stdOut, stdErr],
        });
        subprocess.unref();
        console.log("Tried to spawn - check:", { args, stdLog, errLog });
        return true;
    }
    catch (err) {
        console.error(`Error executing or parsing asyncSpawn`, { cmd, params, err });
    }
}
/**
 * If windows, returns array of all bash shells found IN WINDOWS path format
 *
 *
 */
export function winBashes() {
    if (!isWindows()) {
        return false;
    }
    let c1 = spawnSync('where', ['bash'], { shell: true, encoding: 'utf8' });
    if (c1.error) {
        console.error(`Error running command: [cmd, where, bash]`);
        console.error(c1.error);
        return false;
    }
    let bashesStr = c1.stdout.toString();
    let bashes = bashesStr.split('\n');
    return bashes;
}
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
//export function runCommand(command: string, args: any | any[] = [], options: GenObj = {}): string | boolean {
export function runCommand(command, options = {}) {
    let args = options.args;
    args = convertParamsToCliArgs(args);
    let localOpts = {
        debug: true,
        split: false, // Split the output text into 
        shellKey: 'cygwin', // cygwin, git, bash, wsl, powershell, pwsh, cmd
    };
    for (let key in localOpts) {
        if (key in options) {
            localOpts[key] = options[key];
            delete options[key];
        }
    }
    for (let key in localOpts) {
        if (key in options) {
            localOpts[key] = options[key];
            delete options[key];
        }
    }
    let defSpawnOpts = {
        shell: 'bash',
        encoding: 'utf8'
    };
    let spawnOpts = { ...defSpawnOpts, ...options };
    let shellPath = 'bash';
    if (isWindows()) {
        let shellKey = options.shell ?? 'cygwin';
        let winshells = ['cmd', 'powershell', 'pwsh'];
        if (winshells.includes(shellKey)) {
            shellPath = shellKey;
        }
        else { // Look for a bash
            let bashKeyPatterns = {
                cygwin: ['cygwin'],
                wsl: ['System32', 'WindowsApps'],
                git: ['Git', 'git', 'mingw64', 'mingw32'],
            };
            let keySrchArr = bashKeyPatterns[shellKey];
            if (!isEmpty(keySrchArr)) {
                let bshells = winBashes();
                if (bshells) {
                    for (let keyPattern of keySrchArr) {
                        keyPattern = keyPattern.toLowerCase();
                        for (let apath of bshells) {
                            if (apath.toLowerCase().includes(keyPattern)) {
                                shellPath = apath;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    console.error(`In runCommand debug: `, { command, args, spawnOpts, shellPath });
    // If we didn't find a particular bash path, just use "bash" as path
    //@ts-ignore
    const child = spawnSync(command, args, spawnOpts);
    if (child.error) {
        console.error(`Error running command: ${command}`);
        console.error(child.error);
        return '';
    }
    return child.stdout.toString();
}
/*
//Suggested test of runCommand from chatGPT:
let output = runCommand('ls', ['-l', '/path/to/directory'], { shell: true });
console.log(output);
*/
/** Support for asyncSpawn & runCli to build valid CLI arguments from function calls
 */
export function convertParamsToCliArgs(params) {
    let ret = [];
    if (isEmpty(params)) {
        console.error(`In convertParamsToCliArgs: params is empty!`);
        return ret;
    }
    if (!Array.isArray(params)) {
        params = [params];
    }
    //@ts-ignore
    for (let param of params) {
        if (isSimpleType(param)) {
            ret.push(param);
        }
        else if (isSimpleObject(param)) {
            for (let key in param) {
                ret.push(`--${key}=${param[key]}`);
            }
        }
        else {
            //throwLog(`Unparsable param`, param);
            console.error(`Unparsable param`, param);
        }
    }
    console.error(`In convertParamsToCliArgs:`, { params, ret });
    return ret;
}
/**
 * Outputs all args to stdOut, without console processing - but any arg not stringish is stringified
 */
export function stdOut(...args) {
    for (let arg of args) {
        if (typeof arg !== "string") {
            arg = JSON5Stringify(arg);
        }
        process.stdout.write(arg);
    }
}
export function utilInspect(obj, opts) {
    let defOpts = { showHidden: true, depth: null, showProxy: true, maxArrayLength: null, maxStringLength: null, breakLength: 200, getters: true, compact: 7 };
    defOpts = { showHidden: true, depth: 15, maxArrayLength: 200, maxStringLength: 1000, breakLength: 200, };
    if (!opts) {
        opts = defOpts;
    }
    return util.inspect(obj, opts);
}
export function dbgPath(fname) {
    fname = `${fname}.json5`;
    return slashPath(cwd, 'tmp', fname);
}
/** Change argument order to make path optional*/
export function dbgWrt(arg, fpath = 'debug', append = false) {
    return dbgWrite(fpath, arg, append);
}
export function dbgWrite(fpath, arg, append = false) {
    let dpath = dbgPath(fpath);
    return writeFile(dpath, arg, append);
}
export function compareArrays(arr1, arr2) {
    let shared = intersect(arr1, arr2);
    let sharedCnt = shared.length;
    let onlyArr1 = inArr1NinArr2(arr1, arr2);
    let onlyArr1Cnt = onlyArr1.length;
    let onlyArr2 = inArr1NinArr2(arr2, arr1);
    let onlyArr2Cnt = onlyArr2.length;
    let arr1Cnt = arr1.length;
    let arr2Cnt = arr2.length;
    return { arr1, arr2, arr1Cnt, arr2Cnt, shared, sharedCnt, onlyArr1, onlyArr1Cnt, onlyArr2, onlyArr2Cnt };
}
/**
 * Better param order for writeFile
 */
export function writeData(arg, fpath = '.', append = false) {
    return writeFile(fpath, arg, append);
}
export function writeFile(fpath, arg, append = false) {
    if (arg === undefined) {
        arg = "undefned";
    }
    else if (arg === null) {
        arg = "null";
    }
    fpath = slashPath(fpath);
    if (isDirectory(fpath)) {
        fpath = path.join(fpath, "debug-out.json");
    }
    //let fexists = fs.existsSync(fpath);
    let flag = 'w';
    if (append) {
        flag = 'a';
    }
    let opts = { flag };
    /*
    let fpdname = path.join(__dirname, fpath);
    let fpcwd = path.join(process.cwd(), fpath);
    let dirs = {
      dirname: __dirname,
      cwd: process.cwd(),
      fpdname: path.join(__dirname, fpath),
      fpcwd: path.join(process.cwd(), fpath),
    };
    */
    let dir = path.posix.dirname(fpath);
    let dires = fs.mkdirSync(dir, { recursive: true });
    //console.log(`writeFile to ${fpath}`);
    if (!isPrimitive(arg)) {
        arg = JSON5Stringify(arg);
    }
    return fs.writeFileSync(fpath, arg, opts);
}
/**
 * ANOTHER TRY!! Write data to a file - with better options, defaults & params....
  //function sayName({first='Bob',last='Smith'}: {first?: string; last?: string}={}){
    Writes arg data to a file - cpnfirrable with type, path, options, etc.
    @param any arg - data to write

 */
export function saveData(arg, { fname = 'dbg-out', fpath = null, type = 'json5', dir = './tmp', append = false } = {}) {
    // Get/Make the file output path
    type = (type === 'json5') ? 'json5' : 'json';
    let fullPath = fpath ?? slashPath(dir, `${fname}.${type}`);
    let dirName = path.posix.dirname(fullPath);
    let dires = fs.mkdirSync(dirName, { recursive: true });
    if (!isPrimitive(arg)) {
        if (type === 'json5') {
            arg = JSON5Stringify(arg);
        }
        else {
            arg = JSON.stringify(arg);
        }
    }
    //console.log("Testing new saveData fnc:", { arg, fname, fpath,  type, fullPath, dirName, dir, append }); 
    let flag = 'w';
    if (append) {
        flag = 'a';
    }
    let opts = { flag };
    return fs.writeFileSync(fullPath, arg, opts);
}
export function getFrameAfterFunction(fname, forceFunction) {
    if (fname && typeof fname === "string") {
        fname = [fname];
    }
    if (!Array.isArray(fname)) {
        fname = [];
    }
    /*
    if (!Array.isArray(fname)) {
      fname = [];
    }
    */
    let stack;
    try {
        stack = ESP.parse(new Error());
    }
    catch (err) {
        //console.error("Error in ESP.parse/getFrameAfterFunction:", jsonClone(err));
        console.error("Error in ESP.parse/getFrameAfterFunction:");
        return;
    }
    //console.log("Enter getFrameAfter initial stack:", { stack });
    //Test skipping all until find fname
    /*
     if (fname) {
       console.log({ fname });
       let tstFrame: any;
       while ( tstFrame = stack.shift()) {
         console.log({ tstFrame });
         if (fname.includes(tstFrame.functionName)) {
           break;
         }
       }
     }
     */
    let excludeFncs = [
        "errLog", "baseLog", "getFrameAfterFunction", "getFrameAfterFunction2", "consoleLog", "consoleError",
        "infoLog", "debugLog", "stamp", "fulfilled", "rejected", "processTicksAndRejections", "LogData.log",
        "LogData.out", "LogData.console", "LogData.errLog", "LogData.throw",
    ];
    //let fnSkips = ["__awaiter", "Object.<anonymous>", "undefined", undefined];
    let fnSkips = ["__awaiter", "undefined", undefined];
    let allSkips = fnSkips.concat(excludeFncs);
    let skips = excludeFncs.concat(fname);
    //writeFile(`../tmp/stack-${uv}.json`, stack);
    //  console.log("Rest of the Stack:", { stack });
    let lastFrame = stack.shift();
    let frame;
    let nextFrame;
    while ((frame = stack.shift())) {
        lastFrame = frame;
        //if (frame.functionName && !skips.includes(frame.functionName)) {
        if (!skips.includes(frame.functionName)) {
            //if (frame.functionName && !allSkips.includes(frame.functionName)) {
            break;
        }
    }
    /*
    while ((frame = stack.shift())) {
      if (skips.includes(frame.functionName)) {
        lastFrame = stack.shift();
      } else {
        break;
      }
    }
    */
    //  console.log("After break - should have lastFrame!", { lastFrame, frame, stack });
    let functionName = lastFrame.functionName;
    let exFns = skips.concat(fnSkips);
    //if (!functionName || (exFns.includes(functionName) && forceFunction)) {
    if (!functionName || (exFns.includes(functionName) && forceFunction)) {
        //console.log(`Skipping ${functionName}`, { lastFrame });
        // Continue through frames for next function name...
        //'Object.<anonymous>'
        while ((nextFrame = stack.shift())) {
            let tsFn = nextFrame.functionName;
            if (tsFn && !exFns.includes(tsFn)) {
                functionName = nextFrame.functionName;
                //      console.log(`Returning? tsFn: ${tsFn}, fname: ${functionName} `);
                lastFrame.functionName = functionName;
                return lastFrame;
                //break;
            }
        }
    }
    return lastFrame;
}
/** File based msg logging - when no db...
 * @param any msg - gotta have something...
 * @param string? lpath: some path to the log file,
 * or we make a best guess
 * @return ???
 */
export function logMsg(msg, lpath) {
    //Should have a path - is it a file or dir? Does it exist?
    if (!lpath) {
        if (process.env.LOGPATH) {
            lpath = process.env.LOGPATH;
        }
        else {
            lpath = path.join(process.cwd(), 'logs', 'default.log');
        }
    }
    //Does lpath exist? Is it a dir?
    let data = {
        time: new Date(),
        lstack: stackParse(),
        stamp: stamp(),
    };
    //What to do w. message?
    if (msg instanceof Error) {
        data.msg = msg.message;
        data.stack = msg.stack;
        data.name = msg.name;
        //@ts-ignore
        data.column = msg.columnNumber;
        //@ts-ignore
        data.line = msg.lineNumber;
        //@ts-ignore
        data.file = msg.fileName;
        data.raw = msg;
    }
    else {
        data.msg = msg;
    }
    try {
        let res = writeFile(lpath, data, true);
        return res;
    }
    catch (err) {
        console.error(`Whoops! Exception logging error!`, { msg, lpath, data, err });
        return false;
    }
}
/** Call from a catch - logs error to file, console.error, & returns false
 */
export function catchErr(err, ...rest) {
    console.error(`There was an exception:`, { err, rest, stamp: stamp() });
    logMsg(err);
    return false;
}
export function loadJson(afile) {
    let json = fs.readFileSync(afile, "utf8");
    let obj = JSON5Parse(json);
    return obj;
}
//# sourceMappingURL=node-operations.js.map