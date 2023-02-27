/**
 * Library of JS/TS functions specifically for Node.js - extends 'pk-ts-common-lib' functions
 * that are pure JS & not browser/node dependent
 * @author Paul Kirkaas
 * @email pkirkaas@gmail.com
 * 
 */

import fs from "fs-extra";
//export const  path =  require( 'path');
import   path from  'path';
import util from 'util';
import os from "os";
import { spawn }  from  "child_process";
import * as ESP from "error-stack-parser";
import { format, isValid } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { isEmpty,  isSimpleType,isSimpleObject,JSON5Stringify,isPrimitive,inArr1NinArr2, intersect, GenericObject} from 'pk-ts-common-lib';

util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.depth = null;
util.inspect.defaultOptions.breakLength = 200;
  export const excludeFncs = [
    "errLog", "baseLog", "getFrameAfterFunction", "getFrameAfterFunction2", "consoleLog", "consoleError",
    "infoLog", "debugLog", "stamp", "fulfilled", "rejected", "processTicksAndRejections", "LogData.log",
    "LogData.out", "LogData.console", "LogData.errLog", "LogData.throw", 'catchErr', 'logMsg',
  ];
  //let fnSkips = ["__awaiter", "Object.<anonymous>", "undefined", undefined];
  export const fnSkips = ["__awaiter", "undefined", undefined];
  export const allSkips = fnSkips.concat(excludeFncs);

   export const cwd = process.cwd();


  /** Uses util.inspect to stringify an arg
   * @param object? opts - to override the default opts 
   * @return string representation
   */
export function objInspect(arg, opts?: GenericObject) {
  let defOpts: GenericObject = {
    showHidden: true,
    depth: 20,
    showProxy: true,
    getters: true,
  }
  if (opts && typeof opts === 'object') {
    Object.assign(defOpts, opts);
  }
  return util.inspect(arg, defOpts);
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
export function stamp(entry?: any, frameAfter?: any) {
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
  let ds = format(now, "y-LL-dd H:m:s");
  return `${ds}-${pe}${src}: ${entId} `;
}

export function getProcess() {
	console.log(process.env);
	return process.env
}



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

/** Support for asyncSpawn & runCli to build valid CLI arguments from function calls
 */
export function convertParamsToCliArgs(params) {
  let ret = [];
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
  return ret;
}



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
  return slashPath(cwd, 'tmp', fname);
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
export function writeData(arg:any, fpath='.',  append: boolean = false) {
  return writeFile(fpath, arg, append);
}
export function writeFile(fpath, arg: any, append:boolean = false) {
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


export function getFrameAfterFunction(fname?: any, forceFunction?: any) {
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
  let stack: any;
  try {
    stack = ESP.parse(new Error());
  } catch (err) {
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
  let uv = uuidv4();
  //writeFile(`../tmp/stack-${uv}.json`, stack);
  //  console.log("Rest of the Stack:", { stack });
  let lastFrame: any = stack.shift();
  let frame: any;
  let nextFrame: any;

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
  let functionName: any = lastFrame.functionName;

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
  }
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
  console.error(`There was an exception:`, { err, rest, stamp:stamp() });
  logMsg(err);
  return false;
}