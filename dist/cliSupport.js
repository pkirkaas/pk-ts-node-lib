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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.runCli = exports.argv = void 0;
/** CLI Support for async scripts */
var path = require("path");
var cwd = process.cwd();
require("dotenv").config(path.join(cwd, ".env"));
//import { argv } from '../utils/database/init';
var https = require("https");
var axios = require("axios");
var os = require("os");
var fs = require("fs-extra");
var util = require("util");
//const inquirer = require("inquirer");
//import { inquirer }  from "inquirer";
var yargs = require("yargs/yargs");
var hideBin = require("yargs/helpers").hideBin;
var pk_ts_common_lib_1 = require("pk-ts-common-lib");
exports.argv = yargs(hideBin(process.argv)).argv;
/** Support for CLI commands & tests with ts-node
 * From a test script (test.ts) import runTest - define some test functions:
 *
import { runTest } from "../src";
import { ProductModel, TradingPartnerModel } from '../src';
const SSID = "613f4597f29dae35a2c9c3d4";
const fncs = {
    tstTst: async function () {
        console.log("In tstTst -2 ");
        let tp = await TradingPartnerModel.getDoc(SSID);
        let companyname = tp.companyname;
        console.log({ companyname });
    },
};
runTest(fncs,[cli_env]);

Call from cli with "ts-node <scripts/name.ts testName arg1 arg2"

 */
function runCli(fncs, env) {
    return __awaiter(this, void 0, void 0, function () {
        var largv, args, tofs, params, cmd, fkeys, res, err_1, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Entering runCli");
                    largv = exports.argv;
                    args = largv._;
                    delete largv._; //The rest is an object
                    delete largv.$0;
                    largv = (0, pk_ts_common_lib_1.trueVal)(largv);
                    tofs = typeof fncs;
                    if (tofs === "object") {
                        cmd = args[0];
                        params = args.slice(1);
                    }
                    else if (tofs === "function") {
                        params = args;
                    }
                    else {
                        console.log("What to do with fncs type: ".concat(tofs, "?"));
                        process.exit();
                    }
                    if (!(typeof fncs === "object")) return [3 /*break*/, 5];
                    console.log("\n\nAbout to await run ".concat(cmd, " in environment: [").concat(env, "] with params:"), { params: params, largv: largv });
                    fkeys = Object.keys(fncs);
                    if (!fkeys.includes(cmd)) {
                        console.log("\"".concat(cmd, "\" is not a test function - did you mean one of:"), fkeys);
                        process.exit();
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fncs[cmd].apply(fncs, __spreadArray(__spreadArray([], params, false), [largv], false))];
                case 2:
                    res = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error("There was an error: ".concat(err_1.message), { err: err_1 });
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 8];
                case 5:
                    if (!(typeof fncs === "function")) return [3 /*break*/, 7];
                    console.log("Running single function w. params:", { params: params, largv: largv });
                    return [4 /*yield*/, fncs.apply(void 0, __spreadArray(__spreadArray([], params, false), [largv], false))];
                case 6:
                    res = _a.sent();
                    console.log("Completed Run");
                    return [3 /*break*/, 8];
                case 7:
                    console.log("Don't know what to run!");
                    _a.label = 8;
                case 8:
                    process.exit();
                    return [2 /*return*/];
            }
        });
    });
}
exports.runCli = runCli;
