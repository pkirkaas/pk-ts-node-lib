"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allPropsWithTypes = exports.allProps = exports.filterProps = exports.keepProps = exports.isBuiltIn = exports.builtInName = exports.getProps = exports.isParsed = exports.isParsable = exports.builtInProps = exports.getAllBuiltInProps = exports.jsBuiltIns = exports.jsBuiltInObjMap = exports.getObjDets = exports.getPrototypeChain = exports.classStack = exports.isClassOrFunction = exports.isInstance = exports.getConstructorChain = exports.isObject = exports.isSimpleObject = exports.isPrimitive = exports.isSimpleType = exports.isByRef = exports.trueVal = exports.isEmpty = exports.checkUrl3 = exports.checkUrlAxios = exports.checkUrl = exports.rewriteHttpsToHttp = exports.isCli = exports.isSubset = exports.arraysEqual = exports.intersect = exports.inArr1NinArr2 = exports.dtFmt = exports.pkToDate = exports.asNumeric = exports.isNumeric = exports.jsonClone = exports.JSON5Parse = exports.eventInfo = exports.filterInt = exports.isPromise = exports.strIncludesAny = exports.validateDateFnsDuration = exports.subObj = exports.getStack = exports.JSON5 = exports.urlStatus = void 0;
exports.toSnakeCase = exports.toCamelCase = exports.stripStray = exports.parseHeaderString = exports.JSONStringify = exports.JSON5Stringify = exports.valWithType = exports.typeOfEach = exports.randInt = exports.getRandEls = exports.getRand = exports.typeOf = exports.uniqueVals = exports.objInfo = void 0;
//const urlStatus = require('url-status-code');
const url_status_code_1 = __importDefault(require("url-status-code"));
exports.urlStatus = url_status_code_1.default;
const json5_1 = __importDefault(require("json5"));
exports.JSON5 = json5_1.default;
//const JSON5 = require('json5');
//linked?
//const _ = require("lodash");
const lodash_1 = __importDefault(require("lodash"));
const index_js_1 = require("./index.js");
//@ts-ignore
//import jsondecycle from "json-decycle";
//import { jsondecycle } from "./lib/json-decycle.js";
const json_decycle_js_1 = require("./lib/json-decycle.js");
//export { jsondecycle };
//decycle, retrocycle, extend
//@ts-ignore
(0, json_decycle_js_1.extend)(json5_1.default);
//const axios = require("axios");
//import { axios } from "Axios";
const axios_1 = __importDefault(require("axios"));
const date_fns_1 = require("date-fns");
//const path = require("path/posix");
//const path = require("path/posix");
/** NODE SPECIFIC
*/
/**
 * Returns stack trace as array
 * Error().stack returns a string. Convert to array
 * @param offset - optional - how many levels shift off
 * the top of the array
 * @retrun array stack
 */
function getStack(offset = 0) {
    offset += 2;
    let stackStr = Error().stack;
    let stackArr = stackStr.split("at ");
    //console.log({ stackArr });
    stackArr = stackArr.slice(offset);
    let ret = [];
    for (let row of stackArr) {
        ret.push(row.trim());
    }
    return ret;
}
exports.getStack = getStack;
/**
 * Return just the subset of the object, for keys specified in the "fields" array.
 */
function subObj(obj, fields) {
    let ret = {};
    for (let field of fields) {
        ret[field] = obj[field];
    }
    return ret;
}
exports.subObj = subObj;
/** Takes a 'duration' object for date-fns/add and validate
 * it. Optionall, converts to negative (time/dates in past)
 * @param obj object - obj to test
 * @param boolean forceNegative - force to negative/past offest?
 * @return duration
 */
function validateDateFnsDuration(obj, forceNegative = false) {
    if (!isSimpleObject(obj) || isEmpty(obj)) {
        return false;
    }
    let dfnsKeys = [`years`, `months`, `weeks`, `days`, `hours`, `minutes`, `seconds`,];
    /*
    let objKeys = Object.keys(obj);
    let ret: any = {};
    */
    for (let key in obj) {
        if (!dfnsKeys.includes(key)) {
            return false;
        }
        if (forceNegative) {
            obj[key] = -Math.abs(obj[key]);
        }
        return obj;
    }
}
exports.validateDateFnsDuration = validateDateFnsDuration;
/**
 * Returns true if arg str contains ANY of the what strings
 */
function strIncludesAny(str, substrs) {
    if (!Array.isArray(substrs)) {
        substrs = [substrs];
    }
    for (let substr of substrs) {
        if (str.includes(substr)) {
            return true;
        }
    }
    return false;
}
exports.strIncludesAny = strIncludesAny;
function isPromise(arg) {
    return !!arg && typeof arg === "object" && typeof arg.then === "function";
}
exports.isPromise = isPromise;
/** From Mozilla - a stricter int parser */
function filterInt(value) {
    if (/^[-+]?(\d+|Infinity)$/.test(value)) {
        return Number(value);
    }
    else {
        //return NaN
        return false;
    }
}
exports.filterInt = filterInt;
/*
export function getEspStack() {
  let stack = ESP.parse(new Error());
  return stack;
}
*/
/**
 * Takes a browser event & tries to get some info
 * Move this to browser library when the time comes
 */
function eventInfo(ev) {
    let evProps = ['bubbles', 'cancelable', 'cancelBubble', 'composed', 'currentTarget',
        'defaultPrevented', 'eventPhase', 'explicitOriginalTarget', 'isTrusted',
        'originalTarget', 'returnValue', 'srcElement', 'target',
        'timeStamp', 'type',];
    let eventDets = {};
    for (let prop of evProps) {
        eventDets[prop] = jsonClone(ev[prop]);
    }
    return eventDets;
}
exports.eventInfo = eventInfo;
function JSON5Parse(str) {
    try {
        return json5_1.default.parse(str);
    }
    catch (e) {
        let eInfo = objInfo(e);
        return {
            json5ParseError: e,
            eInfo,
            origStr: str,
        };
    }
}
exports.JSON5Parse = JSON5Parse;
/** Try to make simple copies of complex objects (like with cyclic references)
 * to be storable in MongoDB
 * Primitives will just be returned unchanged.
 */
function jsonClone(arg) {
    if (!arg || typeof arg !== "object" || isPrimitive(arg)) {
        return arg;
    }
    //@ts-ignore
    if ((typeof Element !== 'undefined') && (arg instanceof Element)) {
        //Not sure I want to do this - my JSON5Stringify might handle it - test in browser
        return arg.outerHTML;
    }
    //return JSON5.parse(JSON5Stringify(arg));
    return JSON5Parse(JSON5Stringify(arg));
}
exports.jsonClone = jsonClone;
/**
 * Checks if the arg can be converted to a number
 * If not, returns boolean false
 * If is numeric:
 *   returns boolean true if asNum is false
 *   else returns the numeric value (which could be 0)
 * @param asNum boolean - if true,
 *
 */
function isNumeric(arg, asNum = false) {
    let num = Number(arg);
    if (num !== parseFloat(arg)) {
        return false;
    }
    if (asNum) {
        return num;
    }
    return true;
}
exports.isNumeric = isNumeric;
/**
 * Returns the numeric value, or boolean false
 */
function asNumeric(arg) {
    return isNumeric(arg, true);
}
exports.asNumeric = asNumeric;
/**
 * If arg can be in any way be interpreted as a date,
 * returns the JS Date object,
 * NOTE: Unlike regulare JS :
 *
 * let dtE = new Date(); //Now
 * let dtN = new Date(null); //Start of epoch
 * Valid arg values:
 *    null - returns new Date() - now
 *    new Date("2016-01-01")
 *   "2016-01-01"
 *    1650566202871
 *   "1650566202871"
 *   "2022-04-21T18:36:42.871Z"
 * Returns a valid JS Date object or false
 * -- Why not just 'new Date(arg)'??
 * Because: new Date(1650566202871) works
 * BUT new Date("1650566202871") DOESN'T - and sometimes
 * the DB returns a timestamp as a string...
 */
function pkToDate(arg) {
    if (isNumeric(arg)) {
        arg = new Date(Number(arg));
    }
    else if (isEmpty(arg)) {
        arg = new Date();
    }
    else {
        arg = new Date(arg);
    }
    if ((arg instanceof Date) && (0, date_fns_1.isValid)(arg)) {
        return arg;
    }
    return false;
}
exports.pkToDate = pkToDate;
/**
 * Quick Format a date with single format code & date
 * @param string fmt - one of an array
 * @param dt - datable or if null now  - but - if invalid, though returns false
 */
function dtFmt(fmt, dt) {
    let fmts = {
        short: 'dd-MMM-yy',
        dt: 'dd-MMM-yy KK:mm',
        dts: 'dd-MMM-yy KK:mm:ss',
        ts: 'KK:mm:ss',
    };
    let keys = Object.keys(fmts);
    if (!keys.includes(fmt)) {
        fmt = 'short';
    }
    dt = pkToDate(dt);
    if (dt === false) {
        return "FALSE";
    }
    let fullFmt = fmts[fmt];
    return (0, date_fns_1.format)(dt, fullFmt);
}
exports.dtFmt = dtFmt;
//Array utilities
/**
 * Return elements in arr1 Not In arr2
 */
function inArr1NinArr2(arr1, arr2) {
    return arr1.filter((el) => !arr2.includes(el));
}
exports.inArr1NinArr2 = inArr1NinArr2;
/**
 * Uniqe intersection of two arrays
 */
function intersect(a, b) {
    var setB = new Set(b);
    return [...new Set(a)].filter(x => setB.has(x));
}
exports.intersect = intersect;
/**
 * Compares arrays by VALUES - independant of order
 */
function arraysEqual(a, b) {
    return JSON.stringify(a.sort()) === JSON.stringify(b.sort());
}
exports.arraysEqual = arraysEqual;
/**
 * Is 'a' a subset of 'b' ?
 */
function isSubset(a, b) {
    a = [...new Set(a)];
    b = [...new Set(b)];
    return a.every((val) => b.includes(val));
}
exports.isSubset = isSubset;
//TODO - REDO! This sucks...
function isCli(report = false) {
    let runtime = process.env.RUNTIME;
    //let runtime = getRuntime();
    let lisCli = runtime === "cli";
    if (!lisCli && report) {
        console.error("WARNING - calling a CLI-ONLY function in a non-cli runtime:", { runtime });
    }
    console.log("In isCli; runtime:", { runtime, lisCli });
    return lisCli;
}
exports.isCli = isCli;
function rewriteHttpsToHttp(url) {
    let parts = url.split(":");
    if (parts[0] === "https") {
        parts[0] = "http";
    }
    let newUrl = `${parts[0]}:${parts[1]}`;
    return newUrl;
}
exports.rewriteHttpsToHttp = rewriteHttpsToHttp;
/**
 * check single url or array of urls
 * if single url, return true/false
 * if array, return array of failed urls
 * TODO!! Doesn't accout for network errors, exceptions, etc!!
 * SEE below checkUrl3
 */
function checkUrl(url) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Array.isArray(url)) {
            let badUrls = [];
            for (let aurl of url) {
                let status = yield (0, url_status_code_1.default)(aurl);
                if (status != 200) {
                    badUrls.push(aurl);
                }
            }
            if (!badUrls.length) {
                return true;
            }
            return badUrls;
        }
        else {
            let status = yield (0, url_status_code_1.default)(url);
            if (status == 200) {
                return true;
            }
            return false;
        }
    });
}
exports.checkUrl = checkUrl;
function mkUrl(url) {
    try {
        let urlObj = new URL(url);
        return urlObj;
    }
    catch (err) {
        //console.error({ url, err });
        if ((typeof err === 'object') && (err.code)) {
            return err.code;
        }
        return err;
    }
}
//Same as above, but 
function mkUrlObj(url, full = false) {
    try {
        let urlObj = new URL(url);
        return urlObj;
    }
    catch (err) {
        if (full) {
            return err;
        }
        //console.error({ url, err });
        if ((typeof err === 'object') && (err.code)) {
            return err.code;
        }
        return err;
    }
}
function checkUrlAxios(tstUrl, full = false) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        //let lTool = new LogTool({context: 'checkUrlStatus'});
        //  let lTool = LogTool.getLog('chkStatA', { context: 'checkUrlAxios' });
        let failCodes = [404, 401, 403, 404]; // Return immediate false
        let retryCodes = [408, 429,]; // Try again
        let notAllowed = 405;
        /*
        let fOpts:GenObj = {
          method: "HEAD",
          cache: "no-cache",
          headers: {
          },
          connection: "close",
        };
        */
        let fOpts = {
            method: "HEAD",
            cache: "no-cache",
            headers: {
                Connection: 'close',
            },
            connection: "close",
        };
        let retries = 0;
        let maxRetries = 4;
        let timeout = 5;
        let urlObj = mkUrlObj(tstUrl, full);
        if (!(urlObj instanceof URL)) {
            if (full) {
                return urlObj;
            }
            return { err: tstUrl };
        }
        fOpts.url = tstUrl;
        let resps = [];
        let resp;
        let lastErr;
        try {
            while (retries < maxRetries) {
                retries++;
                lastErr = null;
                //@ts-ignore
                try {
                    resp = yield (0, axios_1.default)(fOpts);
                }
                catch (err) {
                    lastErr = err;
                    continue;
                }
                let status = resp.status;
                if (status === notAllowed) {
                    fOpts.method = "GET";
                    //@ts-ignore
                    resp = yield (0, axios_1.default)(fOpts);
                    status = resp.status;
                }
                if (status === 200) {
                    return true;
                }
                else if (failCodes.includes(status)) {
                    return false;
                }
                else if (retryCodes.includes(status)) {
                    continue;
                }
            } // Unknown reason for failure
            if (resp) {
                let respKeys = Object.keys(resp);
                let status = resp.status;
                let toResp = typeOf(resp);
                resp['retries'] = retries;
                let barg = { badresponse: { tstUrl, respKeys, status, toResp, resp } };
                //lTool.snap(barg);
                if (full) {
                    return resp;
                }
                return `code: [${resp.code}]; url: [${tstUrl}], status: [${resp.status}], retries: [${retries}]`;
            }
            else if (lastErr) { //Axios error!
                let toErr = typeOf(lastErr);
                let errKeys = Object.keys(lastErr);
                let sarg = { exception: { toErr, errKeys, lastErr, retries, tstUrl } };
                //lTool.snap({ err, retries, tstUrl });
                // console.log({ sarg });
                //lTool.snap(sarg);
                if (full) {
                    return lastErr;
                }
                let ret;
                if (typeof lastErr === 'object') {
                    (_a = lastErr === null || lastErr === void 0 ? void 0 : lastErr.cause) === null || _a === void 0 ? void 0 : _a.code;
                }
                if (!ret) {
                    ret = lastErr;
                }
                return ret;
            }
            let ret = {
                unkown: { retries, tstUrl, msg: "No error and no response?" }
            };
            //lTool.snap(ret);
            return ret;
            //console.log({ resp, respKeys });
            //console.log({  toResp, status, respKeys });
        }
        catch (err) {
            console.error("WE SHOULDN'T BE HERE!!", err);
            let toErr = typeOf(err);
            let errKeys = Object.keys(err);
            let sarg = { UnexpecteException: { toErr, errKeys, err, retries, tstUrl } };
            //lTool.snap({ err, retries, tstUrl });
            // console.log({ sarg });
            //lTool.snap(sarg);
            if (full) {
                return err;
            }
            let ret;
            if (typeof err === 'object') {
                (_b = err === null || err === void 0 ? void 0 : err.cause) === null || _b === void 0 ? void 0 : _b.code;
            }
            if (!ret) {
                ret = err;
            }
            return ret;
        }
    });
}
exports.checkUrlAxios = checkUrlAxios;
/**
 * Tri-state check - to account for failed checks -
 * @return boolean|other
 * If "true" - good URL
 * If "false" - 404 or something - but GOT A STATUS!
 * IF other - who knows? bad domain, invalid URL, network error,...
 *
 *
 */
function checkUrl3(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let status = yield (0, url_status_code_1.default)(url);
            //let toS = typeOf(status);
            //console.log(`checkUrl3 - toS: ${toS}; status:`, { status });
            if (status == 200) {
                return true;
            }
            else if (status > 300) {
                return false;
            }
            return status;
        }
        catch (err) {
            return { msg: `Exception for URL:`, url, err };
        }
    });
}
exports.checkUrl3 = checkUrl3;
/**
 * This is a tough call & really hard to get right...
 */
function isEmpty(arg) {
    if (!arg || (Array.isArray(arg) && !arg.length)) {
        return true;
    }
    let toarg = typeof arg;
    if (toarg === "object") {
        let props = getProps(arg);
        let keys = Object.keys(arg);
        let aninb = inArr1NinArr2(props, exports.builtInProps);
        //console.log({ props, keys,  aninb });
        if (!keys.length && !aninb.length) {
            return true;
        }
    }
    if (toarg === 'function') {
        return false;
    }
    //console.error(`in isEmpty - returning false for:`, { arg });
    return false;
}
exports.isEmpty = isEmpty;
/**
 * returns arg, unless it is an empty object or array
 */
function trueVal(arg) {
    if (!isEmpty(arg)) {
        return arg;
    }
}
exports.trueVal = trueVal;
/**
 * Arrays & Objects passed by referrence,
 * risk of unintended changes
 */
function isByRef(arg) {
    return !isPrimitive(arg);
}
exports.isByRef = isByRef;
function isSimpleType(arg) {
    let simpletypes = ["boolean", "number", "bigint", "string"];
    let toarg = typeof arg;
    return simpletypes.includes(toarg);
}
exports.isSimpleType = isSimpleType;
function isPrimitive(arg) {
    return arg !== Object(arg);
}
exports.isPrimitive = isPrimitive;
/**
 * Tests if the argument is a "simple" JS object - with just keys
 * & values, not based on other types or prototypes
 */
function isSimpleObject(anobj) {
    if (!anobj || typeof anobj !== "object") {
        return false;
    }
    return Object.getPrototypeOf(anobj) === Object.getPrototypeOf({});
}
exports.isSimpleObject = isSimpleObject;
function isObject(arg, alsoEmpty = false, alsoFunction = true) {
    //if (!arg || isPrimitive(arg) || isEmpty(arg)) {
    if (!arg || isPrimitive(arg) || (isEmpty(arg) && !alsoEmpty)) {
        return false;
    }
    if (alsoFunction && (typeof arg === 'function')) {
        return true;
    }
    return lodash_1.default.isObjectLike(arg);
}
exports.isObject = isObject;
/*
function probeProps(obj, props?: any[],) {
  let def = ['constructor', 'prototype','name','class', 'type','super',];
  let ret: GenObj = {};
  for (let prop of def) {
    try {
      let val = obj[prop];
      if ( val === undefined) {
        continue;
      }
      ret[prop] = { val, type: typeOf(val) };
    } catch (e) {
      console.error(`error in probeProps with prop [${prop}]`, e, obj);
    }
  }
  return ret;
}
 */
function getConstructorChain(obj) {
    let i = 0;
    let constructorChain = [];
    let constructor = obj;
    try {
        while (constructor = constructor.constructor) {
            let toConstructor = typeOf(constructor);
            if ((i++ > 10) || (toConstructor === 'function: Function')) {
                break;
            }
            constructorChain.push({ constructor, toConstructor });
        }
    }
    catch (e) {
        console.error(`Exception w. in getConstructorChain:`, { obj, e });
    }
    return constructorChain;
}
exports.getConstructorChain = getConstructorChain;
/**
 * Checks if arg is an instance of a class.
 * TODO: - have to do lots of testing of different args to
 * verify test conditions...
 * @return - false, or {constructor, className}
 */
function isInstance(arg) {
    if (isPrimitive(arg) || !isObject(arg) || isEmpty(arg)) {
        return false;
    }
    try {
        let constructor = arg === null || arg === void 0 ? void 0 : arg.constructor;
        if (constructor) {
            let className = constructor === null || constructor === void 0 ? void 0 : constructor.name;
            return { constructor, className };
        }
    }
    catch (e) {
        new index_js_1.PkError(`Exception:`, { e, arg });
    }
    return false;
}
exports.isInstance = isInstance;
/**
 * Appears to be no way to distinguish between a to-level class
 * and a function...
 */
function isClassOrFunction(arg) {
    /*
    if ((typeof arg !== 'function') ||
      isPrimitive(arg) || !isObject(arg) || isEmpty(arg)) {
      return false;
    }
    */
    if ((typeof arg === 'function')) {
        try {
            let prototype = Object.getPrototypeOf(arg);
            return prototype;
        }
        catch (e) {
            new index_js_1.PkError(`Exception:`, { e, arg });
        }
    }
    return false;
}
exports.isClassOrFunction = isClassOrFunction;
/**
 * Check whether obj is an instance or a class
 */
function classStack(obj) {
    let tst = obj;
    let stack = [];
    let deref = 'prototypeConstructorName';
    if (!isInstance(obj)) {
        //tst = Object.getPrototypeOf(obj);
        deref = 'prototypeName';
    }
    try {
        let pchain = getPrototypeChain(tst);
        stack = uniqueVals(pchain.map((e) => e[deref]));
        stack = stack.filter((e) => e !== '');
    }
    catch (e) {
        new index_js_1.PkError(`Exception:`, { obj, e, stack });
    }
    return stack;
}
exports.classStack = classStack;
/**
 * This is very hacky - but can be helpful - to get the inheritance
 * chain of classes & instances of classes - lots of bad edge cases -
 * BE WARNED!
 */
function getPrototypeChain(obj) {
    var _a, _b;
    if (!obj) {
        return [];
    }
    let i = 0;
    let prototype = obj;
    let prototypeConstructor = prototype === null || prototype === void 0 ? void 0 : prototype.constructor;
    let prototypeConstructorName = (_a = prototype === null || prototype === void 0 ? void 0 : prototype.constructor) === null || _a === void 0 ? void 0 : _a.name;
    let toPrototype = typeOf(prototype);
    let prototypeName = prototype === null || prototype === void 0 ? void 0 : prototype.name;
    let toPrototypeConstructor = typeOf(prototypeConstructor);
    let prototypeChain = [{ prototype, prototypeName, prototypeConstructorName, toPrototype, prototypeConstructor, toPrototypeConstructor, }];
    try {
        while (prototype = Object.getPrototypeOf(prototype)) {
            //if ((i++ > 20) || isEmpty(prototype)) {
            if ((i++ > 20) || lodash_1.default.isEqual(prototype, {})) {
                //if ((i++ > 20) ) {
                break;
            }
            toPrototype = typeOf(prototype);
            prototypeConstructorName = (_b = prototype === null || prototype === void 0 ? void 0 : prototype.constructor) === null || _b === void 0 ? void 0 : _b.name;
            prototypeConstructor = prototype === null || prototype === void 0 ? void 0 : prototype.constructor;
            prototypeName = prototype === null || prototype === void 0 ? void 0 : prototype.name;
            toPrototypeConstructor = typeOf(prototypeConstructor);
            prototypeChain.push({ prototype, prototypeName, toPrototype, prototypeConstructorName, prototypeConstructor, toPrototypeConstructor, });
        }
    }
    catch (e) {
        console.error(`Exception w. in getPrototypeChain:`, { obj, e });
    }
    return prototypeChain;
}
exports.getPrototypeChain = getPrototypeChain;
function getObjDets(obj) {
    if (!obj || isPrimitive(obj) || !isObject(obj)) {
        return false;
    }
    let toObj = typeof obj;
    let pkToObj = typeOf(obj);
    let props = allProps(obj, 'vtp');
    let prototype = Object.getPrototypeOf(obj);
    let ret = { toObj, pkToObj, props, prototype, };
    return ret;
}
exports.getObjDets = getObjDets;
/**
 * Not complete, but want to be careful...
 * Leave Math out - because it is not a class or constructor...
 */
exports.jsBuiltInObjMap = {
    Object, Array, Date, Number, String, Function,
};
exports.jsBuiltIns = Object.values(exports.jsBuiltInObjMap);
function getAllBuiltInProps() {
    //console.log("Debugging get all builtin props-", { jsBuiltIns });
    let props = [];
    for (let builtIn of exports.jsBuiltIns) {
        let biProps = getProps(builtIn);
        //@ts-ignore
        //console.log(`Loading props for builtin: [${builtIn.name}]`, { biProps });
        props = [...props, ...getProps(builtIn)];
    }
    //console.log(`Props before uniqueVals:`, { props });
    props = uniqueVals(props);
    //console.log(`Props AFTER uniqueVals:`, { props });
    return props;
}
exports.getAllBuiltInProps = getAllBuiltInProps;
/**
 * As an exclude list for filtering out props from specific objects, but
 * HAVE TO BE CAREFUL! - Somethings we don't want to exclude, like constructor,
 * name, etc...
 * APPROXIMATELY:
 *  [ 'length', 'name', 'prototype', 'assign', 'getOwnPropertyDescriptor',
    'getOwnPropertyDescriptors', 'getOwnPropertyNames', 'getOwnPropertySymbols',
    'is', 'preventExtensions', 'seal', 'create', 'defineProperties', 'defineProperty', 'freeze', 'getPrototypeOf', 'setPrototypeOf', 'isExtensible', 'isFrozen', 'isSealed', 'keys', 'entries', 'fromEntries',
    'values', 'hasOwn', 'arguments', 'caller', 'constructor', 'apply',
    'bind', 'call', 'toString', '__defineGetter__', '__defineSetter__',
    'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf',
    'propertyIsEnumerable', 'valueOf', '__proto__', 'toLocaleString',
    'isArray', 'from', 'of', 'now', 'parse', 'UTC', 'isFinite', 'isInteger',
    'isNaN', 'isSafeInteger', 'parseFloat', 'parseInt', 'MAX_VALUE',
    'MIN_VALUE', 'NaN', 'NEGATIVE_INFINITY', 'POSITIVE_INFINITY', 'MAX_SAFE_INTEGER', 'MIN_SAFE_INTEGER', 'EPSILON', 'fromCharCode',
    'fromCodePoint', 'raw', ],
 */
exports.builtInProps = getAllBuiltInProps();
/**
 * Any point to decompose this with allProps?
 */
function isParsable(arg) {
    if (!arg || isEmpty(arg) || isPrimitive(arg) ||
        //@ts-ignore
        (arg === Object) || (arg === Array) || (arg === Function) ||
        (!isObject(arg) && (typeof arg !== 'function'))) {
        return false;
    }
    return true;
}
exports.isParsable = isParsable;
function isParsed(arg) {
    if (!arg || isEmpty(arg) || isPrimitive(arg) ||
        //@ts-ignore
        (arg === Object) || (arg === Array) || (arg === Function) ||
        (!isObject(arg) && (typeof arg !== 'function'))) {
        return arg;
    }
    return false;
}
exports.isParsed = isParsed;
/**
 * Returns property names from prototype tree. Even works for primitives,
 * but not for null - so catch the exception & return []
 */
function getProps(obj) {
    if (!obj) {
        return [];
    }
    try {
        let tstObj = obj;
        let props = Object.getOwnPropertyNames(tstObj);
        while (tstObj = Object.getPrototypeOf(tstObj)) {
            let keys = Object.getOwnPropertyNames(tstObj);
            for (let key of keys) {
                props.push(key);
            }
        }
        return uniqueVals(props);
    }
    catch (e) {
        new index_js_1.PkError(`Exception in getProps-`, { obj, e });
    }
    return [];
}
exports.getProps = getProps;
/**
 * Weirdly, most built-ins have a name property, & are of type [Function:Date]
 * or whatever, but Math does NOT have a name property, and is of type "Object [Math]". So try to deal with that...
 */
function builtInName(bi) {
    var _a;
    let biName = (_a = bi.name) !== null && _a !== void 0 ? _a : bi.toString();
    if ((typeof biName !== 'string') || !biName) {
        throw new index_js_1.PkError(`Weird - no name to be made for BI:`, { bi });
    }
    return biName;
}
exports.builtInName = builtInName;
/**
 * Returns false if arg is NOT a built-in - like Object, Array, etc,
 * OR - the built-in Name as string.
 */
function isBuiltIn(arg) {
    try { //For null, whatever odd..
        if (exports.jsBuiltIns.includes(arg)) {
            //return arg.name ?? arg.toString();
            return builtInName(arg);
        }
    }
    catch (e) {
        new index_js_1.PkError(`Exception in isBuiltin for arg:`, { arg, e });
    }
    return false;
}
exports.isBuiltIn = isBuiltIn;
//skipProps - maybe stuff like 'caller', 'callee', 'arguments'?
exports.keepProps = ['constructor', 'prototype', 'name', 'class',
    'type', 'super', 'length',];
function filterProps(props) {
    props = inArr1NinArr2(props, exports.builtInProps);
    props = props.filter((e) => !(e.startsWith('call$')));
    return props;
}
exports.filterProps = filterProps;
/**
 * Inspect an object to get as many props as possible,
 * optionally with values, types, or both - optionally filterd
 * by props
 * @param obj - what to test
 * // @param depth number - what to return
 * //0: just array of prop keys
 * //1: object of keys=>value
 * //2: object of keys => {type, value}
 * @param string opt any or all of: v|t|p|f
 * If 'v' - the raw value
 * If 'p' - a parsed, readable value
 * If 't' - the value type

 * If none of t,v, or p  just array of props

 * If at least one of t,v,p, abject {prop:{value,type,parsed}

 * If f - FULL property details. Default: filter out uninteresting props
 *
 * @param int depth - how many levels should it go?
 */
//export function allProps(obj: any, { dets = 'p', filter = true }: { dets?: string, filter?: boolean } = {}) {
function allProps(obj, opt = 'tvp', depth = 6) {
    if (!isObject(obj)) {
        return typeOf(obj);
    }
    if (depth-- < 0) {
        return 'END';
    }
    /*
    if (!isParsable(obj)) {
      return false;
    }
    */
    //let opts = opt.split('');
    let opts = [...opt];
    let filter = !opts.includes('f');
    let res = isParsed(obj);
    if (res) {
        return {
            val: res, type: typeOf(res), parsed: res,
        };
    }
    /*
    if (isPrimitive(obj) || (!isObject(obj) && (typeof obj !== 'function'))) {
      //return false; // Or the primitive?
      return obj;
    }
    */
    let tstKeys = [];
    for (let prop of exports.keepProps) {
        try {
            let val = obj[prop];
            if (val === undefined) {
                continue;
            }
            tstKeys.push(prop);
        }
        catch (e) {
            console.error(`error in probeProps with prop [${prop}]`, e, obj);
        }
    }
    let objProps = getProps(obj);
    if (filter) {
        objProps = filterProps(objProps);
    }
    let unique = uniqueVals(objProps, tstKeys);
    if (isEmpty(intersect(opts, ['t', 'v', 'p',]))) { //Just the array of props
        return unique;
    } //We want more...
    let retObj = {};
    for (let prop of unique) {
        let ret = {};
        let val = obj[prop];
        if (['prototype', 'constructor'].includes(prop)) {
            let bi;
            if (bi = isBuiltIn(val)) {
                ret.val = bi;
                retObj[prop] = ret;
                continue;
            }
        }
        if (opts.includes('v')) {
            ret.val = val;
        }
        if (opts.includes('t')) {
            ret.type = typeOf(val);
        }
        if (opts.includes('p') && isParsable(val)) {
            ret.parsed = allProps(val, opt, depth);
        }
        retObj[prop] = ret;
    }
    return retObj;
}
exports.allProps = allProps;
function allPropsWithTypes(obj) {
    return allProps(obj, 't');
}
exports.allPropsWithTypes = allPropsWithTypes;
function objInfo(arg, opt = 'tpv') {
    let toArg = typeOf(arg);
    let info = { type: toArg };
    if (!isObject(arg)) {
        console.error(`in objInfo - arg not object?`, { arg, toArg });
        return info;
    }
    try {
        let objProps = {};
        //SHOULD CHANGE BELOW TO isParsed()...
        if (isParsable(arg)) {
            let instance = isInstance(arg);
            let inheritance = classStack(arg);
            if (instance) {
                info.instance = instance;
            }
            if (inheritance && Array.isArray(inheritance) && inheritance.length) {
                info.inheritance = inheritance;
            }
            //objProps = allPropsWithTypes(arg);
            objProps = allProps(arg, opt);
            if (objProps) {
                info.props = objProps;
            }
        }
        else {
            info.val = arg;
            info.parsed = arg;
        }
    }
    catch (e) {
        console.error(`Exception in objInfo for`, { e, arg, opt, info });
    }
    return info;
}
exports.objInfo = objInfo;
/**
 * Take input arrays, merge, & return single array w. unique values
 */
function uniqueVals(...arrs) {
    let merged = [];
    for (let arr of arrs) {
        merged = [...merged, ...arr];
    }
    return Array.from(new Set(merged));
}
exports.uniqueVals = uniqueVals;
/* Use lodash isObject (excludes functions) or isObjectLike (includes functions)
export function isRealObject(anobj) {
  if (!anobj || typeof anobj !== "object") {
    return false;
  }
  return Object.getPrototypeOf(anobj) === Object.getPrototypeOf({});
}
*/
//export function typeOf(anObj: any, level?: Number): String {
function typeOf(anObj, opts) {
    var _a;
    let level = null;
    let functionPrefix = 'function: ';
    let simplePrefix = 'simple ';
    if (isPrimitive(opts)) {
        level = opts;
    }
    else if (isSimpleObject(opts)) {
        level = opts.level;
        if (opts.justType) {
            simplePrefix = functionPrefix = '';
        }
    }
    try {
        if (anObj === null) {
            return "null";
        }
        let to = typeof anObj;
        if (to === "function") {
            let keys = Object.keys(anObj);
            let name = anObj === null || anObj === void 0 ? void 0 : anObj.name;
            if (!name) {
                name = 'function';
            }
            //      console.log("Function Keys:", keys);
            return `${functionPrefix}${name}`;
        }
        if (to !== "object") {
            return to;
        }
        if (isSimpleObject(anObj)) {
            //let ret = "Type: Simple Object";
            let ret = `${simplePrefix}Object`;
            if (level) {
                let keys = Object.keys(anObj);
                ret += `\nKeys: ${JSON.stringify(keys)}`;
            }
            return ret;
        }
        if (!anObj) {
            return 'undefined?';
        }
        let ret = `${(_a = anObj === null || anObj === void 0 ? void 0 : anObj.constructor) === null || _a === void 0 ? void 0 : _a.name}`;
        if (level) {
            let keys = Object.keys(anObj);
            console.error({ keys });
            ret += `\nKeys: ${JSON.stringify(keys)}`;
        }
        return ret;
    }
    catch (err) {
        console.error("Error in typeOf:", err);
        return JSON.stringify({ err, anObj }, null, 2);
    }
}
exports.typeOf = typeOf;
/**
 * Replace w. below when finished.
 */
function getRand(arr) {
    return arr[Math.floor((Math.random() * arr.length))];
}
exports.getRand = getRand;
/**
 * Gets cnt random unique elements of an array
 * Not the most efficient but it works
 * if cnt = 0, returns a single element, else an array of els
 */
function getRandEls(arr, cnt = null) {
    if (!Array.isArray(arr) || !arr.length) {
        throw new index_js_1.PkError(`Invalid array arg to getRandEls:`, { arr });
    }
    cnt = Math.min(cnt, arr.length);
    if (!cnt) {
        return arr[Math.floor((Math.random() * arr.length))];
    }
    let arrKeys = Object.keys(arr).map((el) => parseInt(el));
    let keyLen = arrKeys.length;
    cnt = Math.min(cnt, keyLen);
    let subKeys = [];
    let num = 0;
    while (true) {
        let tstKey = getRand(arrKeys);
        if (subKeys.includes(tstKey)) {
            continue;
        }
        subKeys.push(tstKey);
        if (subKeys.length >= cnt) {
            break;
        }
    }
    let ret = subKeys.map((key) => arr[key]);
    let retLen = ret.length;
    return ret;
}
exports.getRandEls = getRandEls;
/**
*/
/**
 * Retuns a random integer
 * @param numeric to - max int to return
 * @param numberic from default 0 - optional starting/min number
 * @return int
 */
function randInt(to, from = 0) {
    // Convert args to ints if possible, else throw
    //@ts-ignore
    if (isNaN((to = parseInt(to)) || isNaN((from = parseInt(from))))) {
        throw new index_js_1.PkError(`Non-numeric arg to randInt():`, { to, from });
    }
    if (from === to) {
        return from;
    }
    if (from > to) {
        let tmp = from;
        from = to;
        to = tmp;
    }
    let bRand = from + Math.floor((Math.random() * ((to + 1) - from)));
    return bRand;
}
exports.randInt = randInt;
/**
 * Lazy way to get type of multiple variables at once
 * @param simple object obj - collection of properties to type
 * @return object - keyed by the original keys, to type
 */
function typeOfEach(obj) {
    if (!isSimpleObject(obj) || isEmpty(obj)) {
        console.error(`Bad obj param to typeOfEach - obj:`, { obj });
        return false;
    }
    let res = {};
    let keys = Object.keys(obj);
    for (let key of keys) {
        let val = obj[key];
        res[key] = typeOf(val);
    }
    return res;
}
exports.typeOfEach = typeOfEach;
function valWithType(val) {
    return { type: typeOf(val), val };
}
exports.valWithType = valWithType;
/** Safe stringify - try first, then acycling */
function JSON5Stringify(arg) {
    try {
        return json5_1.default.stringify(arg, null, 2);
    }
    catch (e) {
        //@ts-ignore
        return json5_1.default.decycle(arg, null, 2);
    }
}
exports.JSON5Stringify = JSON5Stringify;
function JSONStringify(arg) {
    /*
    if (arg === undefined) {
      return 'undefned';
    } else if (arg === null) {
      return 'null';
    }
    */
    try {
        return JSON.stringify(arg, null, 2);
    }
    catch (e) {
        //@ts-ignore
        return JSON.decycle(arg, null, 2);
    }
}
exports.JSONStringify = JSONStringify;
/** Totally lifted from Axios - but they don't export it!
 * Takes an HTTP header string and objectifies it -
 * directives as keys
 * with values or undefined
 * @return object
 */
function parseHeaderString(str) {
    const tokens = Object.create(null);
    const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let match;
    while ((match = tokensRE.exec(str))) {
        tokens[match[1]] = match[2];
    }
    return tokens;
}
exports.parseHeaderString = parseHeaderString;
/**
 * stupid name - but just removes all quotes, spaces, etc
 * from a string.
 */
function stripStray(str) {
    if (!str || typeof str !== 'string') {
        return null;
    }
    str = str.replaceAll(/['" ]/g, '');
    return str;
}
exports.stripStray = stripStray;
/** For attributes, etc, as valid JS variable.
 * BONUS: Strips any extraneous quotes, etc.
 * @return string - camelCased
 */
function toCamelCase(str) {
    if (!str || typeof str !== 'string') {
        return null;
    }
    str = stripStray(str);
    return str.replace(/\W+(.)/g, function (match, chr) {
        return chr.toUpperCase();
    });
}
exports.toCamelCase = toCamelCase;
function toSnakeCase(str) {
    if (!str || typeof str !== 'string') {
        return null;
    }
    str = stripStray(str);
    str = str.replace(/([a-z]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    return str;
}
exports.toSnakeCase = toSnakeCase;
//# sourceMappingURL=common-operations.js.map