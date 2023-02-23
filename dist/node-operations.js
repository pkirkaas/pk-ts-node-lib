"use strict";
/**
 * Library of JS/TS functions specifically for Node.js - extends 'pk-ts-common-lib' functions
 * that are pure JS & not browser/node dependent
 * @author Paul Kirkaas
 * @email pkirkaas@gmail.com
 *
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchErr = exports.logMsg = exports.getFrameAfterFunction = exports.writeFile = exports.writeData = exports.compareArrays = exports.dbgPath = exports.utilInspect = exports.stdOut = exports.convertParamsToCliArgs = exports.asyncSpawn = exports.getProcess = exports.stamp = exports.stackParse = exports.isDirectory = exports.slashPath = exports.objInspect = exports.cwd = exports.allSkips = exports.fnSkips = exports.excludeFncs = exports.path = void 0;
const fs = require("fs-extra");
exports.path = require('path');
const util = require('util');
const os = require("os");
const { spawn } = require("child_process");
const ESP = __importStar(require("error-stack-parser"));
const date_fns_1 = require("date-fns");
const uuid_1 = require("uuid");
const pk_ts_common_lib_1 = require("pk-ts-common-lib");
util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.depth = null;
util.inspect.defaultOptions.breakLength = 200;
exports.excludeFncs = [
    "errLog", "baseLog", "getFrameAfterFunction", "getFrameAfterFunction2", "consoleLog", "consoleError",
    "infoLog", "debugLog", "stamp", "fulfilled", "rejected", "processTicksAndRejections", "LogData.log",
    "LogData.out", "LogData.console", "LogData.errLog", "LogData.throw", 'catchErr', 'logMsg',
];
//let fnSkips = ["__awaiter", "Object.<anonymous>", "undefined", undefined];
exports.fnSkips = ["__awaiter", "undefined", undefined];
exports.allSkips = exports.fnSkips.concat(exports.excludeFncs);
exports.cwd = process.cwd();
/** Uses util.inspect to stringify an arg
 * @param object? opts - to override the default opts
 * @return string representation
 */
function objInspect(arg, opts) {
    let defOpts = {
        showHidden: true,
        depth: 20,
        showProxy: true,
        getters: true,
    };
    if (opts && typeof opts === 'object') {
        Object.assign(defOpts, opts);
    }
    return util.inspect(arg, defOpts);
}
exports.objInspect = objInspect;
//Moded to combine path.join & slashPath - should be compatible
// What about spaces???
function slashPath(...parts) {
    let apath = exports.path.join(...parts);
    return apath.split(exports.path.sep).join(exports.path.posix.sep);
}
exports.slashPath = slashPath;
function isDirectory(apath) {
    return fs.existsSync(apath) && fs.lstatSync(apath).isDirectory();
}
exports.isDirectory = isDirectory;
function stackParse() {
    let stack = ESP.parse(new Error());
    let ret = [];
    for (let info of stack) {
        let res = {
            fileName: exports.path.basename(info.fileName),
            lineNumber: info.lineNumber,
            functionName: info.functionName,
        };
        ret.push(res);
    }
    return ret;
}
exports.stackParse = stackParse;
/** Basic info for console logging */
function stamp(entry, frameAfter) {
    let entId = "";
    //console.log({ entry });
    if (!(0, pk_ts_common_lib_1.isEmpty)(entry) && typeof entry === "object") {
        if (entry.id) {
            entId = entry.id;
        }
    }
    let frame = getFrameAfterFunction(frameAfter, true);
    //let frame = getFrameAfterFunction2(frameAfter, true);
    //let frame = getFrameAfterFunction(frameAfter, true);
    let src = "";
    if (frame) {
        src = `:${exports.path.basename(frame.fileName)}:${frame.functionName}:${frame.lineNumber}:`;
        //console.log({ frame });
    }
    let now = new Date();
    let pe = process.env.PROCESS_ENV;
    let ds = (0, date_fns_1.format)(now, "y-LL-dd H:m:s");
    return `${ds}-${pe}${src}: ${entId} `;
}
exports.stamp = stamp;
function getProcess() {
    console.log(process.env);
    return process.env;
}
exports.getProcess = getProcess;
function asyncSpawn(cmd, ...params) {
    try {
        let args = convertParamsToCliArgs(params);
        let cwd = process.cwd();
        let logDir = exports.path.join(cwd, "logs");
        let stdLog = exports.path.join(logDir, `${cmd}-stdout.log`);
        let errLog = exports.path.join(logDir, `${cmd}-stderr.log`);
        fs.mkdirSync(logDir, { recursive: true });
        let stdOut = fs.openSync(stdLog, "a");
        let stdErr = fs.openSync(errLog, "a");
        let script = exports.path.join(cwd, "dist", "src", `scripts`, `async-jobs.js`);
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
exports.asyncSpawn = asyncSpawn;
/** Support for asyncSpawn & runCli to build valid CLI arguments from function calls
 */
function convertParamsToCliArgs(params) {
    let ret = [];
    for (let param of params) {
        if ((0, pk_ts_common_lib_1.isSimpleType)(param)) {
            ret.push(param);
        }
        else if ((0, pk_ts_common_lib_1.isSimpleObject)(param)) {
            for (let key in param) {
                ret.push(`--${key}=${param[key]}`);
            }
        }
        else {
            //throwLog(`Unparsable param`, param);
            console.error(`Unparsable param`, param);
        }
    }
    return ret;
}
exports.convertParamsToCliArgs = convertParamsToCliArgs;
function stdOut(...args) {
    for (let arg of args) {
        if (typeof arg !== "string") {
            arg = (0, pk_ts_common_lib_1.JSON5Stringify)(arg);
        }
        process.stdout.write(arg);
    }
}
exports.stdOut = stdOut;
function utilInspect(obj, opts) {
    let defOpts = { showHidden: true, depth: null, showProxy: true, maxArrayLength: null, maxStringLength: null, breakLength: 200, getters: true, compact: 7 };
    defOpts = { showHidden: true, depth: 15, maxArrayLength: 200, maxStringLength: 1000, breakLength: 200, };
    if (!opts) {
        opts = defOpts;
    }
    return util.inspect(obj, opts);
}
exports.utilInspect = utilInspect;
function dbgPath(fname) {
    return slashPath(exports.cwd, 'tmp', fname);
}
exports.dbgPath = dbgPath;
function compareArrays(arr1, arr2) {
    let shared = (0, pk_ts_common_lib_1.intersect)(arr1, arr2);
    let sharedCnt = shared.length;
    let onlyArr1 = (0, pk_ts_common_lib_1.inArr1NinArr2)(arr1, arr2);
    let onlyArr1Cnt = onlyArr1.length;
    let onlyArr2 = (0, pk_ts_common_lib_1.inArr1NinArr2)(arr2, arr1);
    let onlyArr2Cnt = onlyArr2.length;
    let arr1Cnt = arr1.length;
    let arr2Cnt = arr2.length;
    return { arr1, arr2, arr1Cnt, arr2Cnt, shared, sharedCnt, onlyArr1, onlyArr1Cnt, onlyArr2, onlyArr2Cnt };
}
exports.compareArrays = compareArrays;
/**
 * Better param order for writeFile
 */
function writeData(arg, fpath = '.', append = false) {
    return writeFile(fpath, arg, append);
}
exports.writeData = writeData;
function writeFile(fpath, arg, append = false) {
    if (arg === undefined) {
        arg = "undefned";
    }
    else if (arg === null) {
        arg = "null";
    }
    fpath = slashPath(fpath);
    if (isDirectory(fpath)) {
        fpath = exports.path.join(fpath, "debug-out.json");
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
    let dir = exports.path.posix.dirname(fpath);
    let dires = fs.mkdirSync(dir, { recursive: true });
    //console.log(`writeFile to ${fpath}`);
    if (!(0, pk_ts_common_lib_1.isPrimitive)(arg)) {
        arg = (0, pk_ts_common_lib_1.JSON5Stringify)(arg);
    }
    return fs.writeFileSync(fpath, arg, opts);
}
exports.writeFile = writeFile;
function getFrameAfterFunction(fname, forceFunction) {
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
    let uv = (0, uuid_1.v4)();
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
exports.getFrameAfterFunction = getFrameAfterFunction;
/** File based msg logging - when no db...
 * @param any msg - gotta have something...
 * @param string? lpath: some path to the log file,
 * or we make a best guess
 * @return ???
 */
function logMsg(msg, lpath) {
    //Should have a path - is it a file or dir? Does it exist?
    if (!lpath) {
        if (process.env.LOGPATH) {
            lpath = process.env.LOGPATH;
        }
        else {
            lpath = exports.path.join(process.cwd(), 'logs', 'default.log');
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
exports.logMsg = logMsg;
/** Call from a catch - logs error to file, console.error, & returns false
 */
function catchErr(err, ...rest) {
    console.error(`There was an exception:`, { err, rest, stamp: stamp() });
    logMsg(err);
    return false;
}
exports.catchErr = catchErr;
//# sourceMappingURL=node-operations.js.map