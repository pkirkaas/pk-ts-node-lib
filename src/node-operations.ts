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

/** Test moving thest functions to common  */

import {
  getFrameAfterFunction, stamp, stackParse, getStack,
} from 'pk-ts-common-lib';

export function setInspectLevels(depth = null, maxArrayLength = null, breakLength = 200, colors = true, maxStringLength = null,) {
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
import { format, isValid } from "date-fns";
import { JSON5, JSON5Parse, isEmpty, isSimpleType, isSimpleObject, JSON5Stringify, isPrimitive, inArr1NinArr2, intersect, GenericObject, arrayToLower, GenObj } from 'pk-ts-common-lib';


export const cwd = slashPath(process.cwd());


/** Uses util.inspect to stringify an arg
 * @param object? opts - to override the default opts 
 * @return string representation
 */
export function objInspect(arg, opts?: GenericObject) {
  let defOpts: GenericObject = {
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
  let apath = path.posix.join(...parts);
  return apath.split(path.sep).join(path.posix.sep);
}

export function isDirectory(apath) {
  return fs.existsSync(apath) && fs.lstatSync(apath).isDirectory();
}

export function isFile(apath) {
  return fs.existsSync(apath) && fs.lstatSync(apath).isFile();
}

/**
 * Ensure a directory exists for a path
 */
export function mkDirForPath(fpath:string) {
  fpath = slashPath(fpath);
  let dir = path.posix.dirname(fpath);
  if (!isDirectory(dir)) {
    let dires = fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
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
export function asyncSpawn(cmd: string, ...params) {
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
  } catch (err) {
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
export function runCommand(command: string, options: GenObj = {}): string | boolean {
  let args = options.args;
  args = convertParamsToCliArgs(args);
  let localOpts = { // Default options for this function
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
    } else { // Look for a bash
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
export function convertParamsToCliArgs(params: string | string[] | GenObj | GenObj[]) {
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
    } else if (isSimpleObject(param)) {
      for (let key in param) {
        ret.push(`--${key}=${param[key]}`);
      }
    } else {
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
export function utilInspect(obj: any, opts?: any) {
  let defOpts: any = { showHidden: true, depth: null, showProxy: true, maxArrayLength: null, maxStringLength: null, breakLength: 200, getters: true, compact: 7 };

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
export function dbgWrt(arg: any, fpath = 'debug', append: boolean = false) {
  console.log(`in dbgWrt about to write to: ${fpath}`);
  return dbgWrite(fpath, arg, append);
}

export function dbgWrite(fpath, arg: any, append: boolean = false) {
  let dpath = dbgPath(fpath);
  return writeFile(dpath, arg, append);
}

export function compareArrays(arr1: [], arr2: []) {
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
export function writeData(arg: any, fpath = '.', append: boolean = false) {
  return writeFile(fpath, arg, append);
}
export function writeFile(fpath, arg: any, append: boolean = false) {
  if (arg === undefined) {
    arg = "undefned";
  } else if (arg === null) {
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
  let dir = path.posix.dirname(fpath);
  let dires = fs.mkdirSync(dir, { recursive: true });
  if (!isPrimitive(arg)) {
    arg = JSON5Stringify(arg);
  }
  console.log(`in writeFile about to write to: ${fpath} with opts:`, opts);
  let fsWriteRet = fs.writeFileSync(fpath, arg, opts);
  return fpath;
}

/**
 * ANOTHER TRY!! Write data to a file - with better options, defaults & params....
  //function sayName({first='Bob',last='Smith'}: {first?: string; last?: string}={}){
    Writes arg data to a file - cpnfirrable with type, path, options, etc.
    @param any arg - data to write

 */
export function saveData(arg: any, { fname = 'dbg-out', fpath = null, type = 'json5', dir = './tmp', append = false } = {}) {
  // Get/Make the file output path
  type = (type === 'json5') ? 'json5' : 'json';
  let fullPath = fpath ?? slashPath(dir, `${fname}.${type}`);
  let dirName = path.posix.dirname(fullPath);
  let dires = fs.mkdirSync(dirName, { recursive: true });
  if (!isPrimitive(arg)) {
    if (type === 'json5') {
      arg = JSON5Stringify(arg);
    } else {
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


/** File based msg logging - when no db...
 * @param any msg - gotta have something...
 * @param string? lpath: some path to the log file,
 * or we make a best guess
 * @return ???
 */

export function logMsg(msg: any, lpath?: string) {
  //Should have a path - is it a file or dir? Does it exist?
  if (!lpath) {
    if (process.env.LOGPATH) {
      lpath = process.env.LOGPATH;
    } else {
      lpath = path.join(process.cwd(), 'logs', 'default.log');
    }
  }
  //Does lpath exist? Is it a dir?

  let data: GenericObject = {
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
  } else {
    data.msg = msg;
  }
  try {
    let res = writeFile(lpath, data, true);
    return res;
  } catch (err) {
    console.error(`Whoops! Exception logging error!`, { msg, lpath, data, err });
    return false;
  }
}

/** Call from a catch - logs error to file, console.error, & returns false
 */
export function catchErr(err: any, ...rest) {
  console.error(`There was an exception:`, { err, rest, stamp: stamp() });
  logMsg(err);
  return false;
}

export function loadJson(afile) {
  let json = fs.readFileSync(afile, "utf8");
  let obj = JSON5Parse(json);
  return obj;
}