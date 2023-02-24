"use strict";
/**
 * Library of JS/TS functions specifically for Node.js - extends 'pk-ts-common-lib' functions
 * that are pure JS & not browser/node dependent
 * @author Paul Kirkaas
 * @email pkirkaas@gmail.com
 *
 */
exports.__esModule = true;
exports.catchErr = exports.logMsg = exports.getFrameAfterFunction = exports.writeFile = exports.writeData = exports.compareArrays = exports.dbgPath = exports.utilInspect = exports.stdOut = exports.convertParamsToCliArgs = exports.asyncSpawn = exports.getProcess = exports.stamp = exports.stackParse = exports.isDirectory = exports.slashPath = exports.objInspect = exports.cwd = exports.allSkips = exports.fnSkips = exports.excludeFncs = exports.path = void 0;
var fs = require("fs-extra");
exports.path = require('path');
var util = require('util');
var os = require("os");
var spawn = require("child_process").spawn;
var ESP = require("error-stack-parser");
var date_fns_1 = require("date-fns");
var uuid_1 = require("uuid");
var pk_ts_common_lib_1 = require("pk-ts-common-lib");
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
    var defOpts = {
        showHidden: true,
        depth: 20,
        showProxy: true,
        getters: true
    };
    if (opts && typeof opts === 'object') {
        Object.assign(defOpts, opts);
    }
    return util.inspect(arg, defOpts);
}
exports.objInspect = objInspect;
//Moded to combine path.join & slashPath - should be compatible
// What about spaces???
function slashPath() {
    var parts = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        parts[_i] = arguments[_i];
    }
    var apath = exports.path.join.apply(exports.path, parts);
    return apath.split(exports.path.sep).join(exports.path.posix.sep);
}
exports.slashPath = slashPath;
function isDirectory(apath) {
    return fs.existsSync(apath) && fs.lstatSync(apath).isDirectory();
}
exports.isDirectory = isDirectory;
function stackParse() {
    var stack = ESP.parse(new Error());
    var ret = [];
    for (var _i = 0, stack_1 = stack; _i < stack_1.length; _i++) {
        var info = stack_1[_i];
        var res = {
            fileName: exports.path.basename(info.fileName),
            lineNumber: info.lineNumber,
            functionName: info.functionName
        };
        ret.push(res);
    }
    return ret;
}
exports.stackParse = stackParse;
/** Basic info for console logging */
function stamp(entry, frameAfter) {
    var entId = "";
    //console.log({ entry });
    if (!(0, pk_ts_common_lib_1.isEmpty)(entry) && typeof entry === "object") {
        if (entry.id) {
            entId = entry.id;
        }
    }
    var frame = getFrameAfterFunction(frameAfter, true);
    //let frame = getFrameAfterFunction2(frameAfter, true);
    //let frame = getFrameAfterFunction(frameAfter, true);
    var src = "";
    if (frame) {
        src = ":".concat(exports.path.basename(frame.fileName), ":").concat(frame.functionName, ":").concat(frame.lineNumber, ":");
        //console.log({ frame });
    }
    var now = new Date();
    var pe = process.env.PROCESS_ENV;
    var ds = (0, date_fns_1.format)(now, "y-LL-dd H:m:s");
    return "".concat(ds, "-").concat(pe).concat(src, ": ").concat(entId, " ");
}
exports.stamp = stamp;
function getProcess() {
    console.log(process.env);
    return process.env;
}
exports.getProcess = getProcess;
function asyncSpawn(cmd) {
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        params[_i - 1] = arguments[_i];
    }
    try {
        var args = convertParamsToCliArgs(params);
        var cwd_1 = process.cwd();
        var logDir = exports.path.join(cwd_1, "logs");
        var stdLog = exports.path.join(logDir, "".concat(cmd, "-stdout.log"));
        var errLog = exports.path.join(logDir, "".concat(cmd, "-stderr.log"));
        fs.mkdirSync(logDir, { recursive: true });
        var stdOut_1 = fs.openSync(stdLog, "a");
        var stdErr = fs.openSync(errLog, "a");
        var script = exports.path.join(cwd_1, "dist", "src", "scripts", "async-jobs.js");
        if (!fs.existsSync(script)) {
            console.error("asyncSpawn couldn't find the script: ".concat(script));
            return false;
        }
        args.unshift(cmd);
        args.unshift(script);
        console.log({ __dirname: __dirname, cwd: cwd_1, cmd: cmd, script: script, args: args });
        var subprocess = spawn("node", args, {
            cwd: cwd_1,
            detached: true,
            stdio: ["ignore", stdOut_1, stdErr]
        });
        subprocess.unref();
        console.log("Tried to spawn - check:", { args: args, stdLog: stdLog, errLog: errLog });
        return true;
    }
    catch (err) {
        console.error("Error executing or parsing asyncSpawn", { cmd: cmd, params: params, err: err });
    }
}
exports.asyncSpawn = asyncSpawn;
/** Support for asyncSpawn & runCli to build valid CLI arguments from function calls
 */
function convertParamsToCliArgs(params) {
    var ret = [];
    for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
        var param = params_1[_i];
        if ((0, pk_ts_common_lib_1.isSimpleType)(param)) {
            ret.push(param);
        }
        else if ((0, pk_ts_common_lib_1.isSimpleObject)(param)) {
            for (var key in param) {
                ret.push("--".concat(key, "=").concat(param[key]));
            }
        }
        else {
            //throwLog(`Unparsable param`, param);
            console.error("Unparsable param", param);
        }
    }
    return ret;
}
exports.convertParamsToCliArgs = convertParamsToCliArgs;
function stdOut() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
        var arg = args_1[_a];
        if (typeof arg !== "string") {
            arg = (0, pk_ts_common_lib_1.JSON5Stringify)(arg);
        }
        process.stdout.write(arg);
    }
}
exports.stdOut = stdOut;
function utilInspect(obj, opts) {
    var defOpts = { showHidden: true, depth: null, showProxy: true, maxArrayLength: null, maxStringLength: null, breakLength: 200, getters: true, compact: 7 };
    defOpts = { showHidden: true, depth: 15, maxArrayLength: 200, maxStringLength: 1000, breakLength: 200 };
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
    var shared = (0, pk_ts_common_lib_1.intersect)(arr1, arr2);
    var sharedCnt = shared.length;
    var onlyArr1 = (0, pk_ts_common_lib_1.inArr1NinArr2)(arr1, arr2);
    var onlyArr1Cnt = onlyArr1.length;
    var onlyArr2 = (0, pk_ts_common_lib_1.inArr1NinArr2)(arr2, arr1);
    var onlyArr2Cnt = onlyArr2.length;
    var arr1Cnt = arr1.length;
    var arr2Cnt = arr2.length;
    return { arr1: arr1, arr2: arr2, arr1Cnt: arr1Cnt, arr2Cnt: arr2Cnt, shared: shared, sharedCnt: sharedCnt, onlyArr1: onlyArr1, onlyArr1Cnt: onlyArr1Cnt, onlyArr2: onlyArr2, onlyArr2Cnt: onlyArr2Cnt };
}
exports.compareArrays = compareArrays;
/**
 * Better param order for writeFile
 */
function writeData(arg, fpath, append) {
    if (fpath === void 0) { fpath = '.'; }
    if (append === void 0) { append = false; }
    return writeFile(fpath, arg, append);
}
exports.writeData = writeData;
function writeFile(fpath, arg, append) {
    if (append === void 0) { append = false; }
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
    var flag = 'w';
    if (append) {
        flag = 'a';
    }
    var opts = { flag: flag };
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
    var dir = exports.path.posix.dirname(fpath);
    var dires = fs.mkdirSync(dir, { recursive: true });
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
    var stack;
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
    var excludeFncs = [
        "errLog", "baseLog", "getFrameAfterFunction", "getFrameAfterFunction2", "consoleLog", "consoleError",
        "infoLog", "debugLog", "stamp", "fulfilled", "rejected", "processTicksAndRejections", "LogData.log",
        "LogData.out", "LogData.console", "LogData.errLog", "LogData.throw",
    ];
    //let fnSkips = ["__awaiter", "Object.<anonymous>", "undefined", undefined];
    var fnSkips = ["__awaiter", "undefined", undefined];
    var allSkips = fnSkips.concat(excludeFncs);
    var skips = excludeFncs.concat(fname);
    var uv = (0, uuid_1.v4)();
    //writeFile(`../tmp/stack-${uv}.json`, stack);
    //  console.log("Rest of the Stack:", { stack });
    var lastFrame = stack.shift();
    var frame;
    var nextFrame;
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
    var functionName = lastFrame.functionName;
    var exFns = skips.concat(fnSkips);
    //if (!functionName || (exFns.includes(functionName) && forceFunction)) {
    if (!functionName || (exFns.includes(functionName) && forceFunction)) {
        //console.log(`Skipping ${functionName}`, { lastFrame });
        // Continue through frames for next function name...
        //'Object.<anonymous>'
        while ((nextFrame = stack.shift())) {
            var tsFn = nextFrame.functionName;
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
    var data = {
        time: new Date(),
        lstack: stackParse(),
        stamp: stamp()
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
        var res = writeFile(lpath, data, true);
        return res;
    }
    catch (err) {
        console.error("Whoops! Exception logging error!", { msg: msg, lpath: lpath, data: data, err: err });
        return false;
    }
}
exports.logMsg = logMsg;
/** Call from a catch - logs error to file, console.error, & returns false
 */
function catchErr(err) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    console.error("There was an exception:", { err: err, rest: rest, stamp: stamp() });
    logMsg(err);
    return false;
}
exports.catchErr = catchErr;
