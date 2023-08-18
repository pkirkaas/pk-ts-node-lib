"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCli = exports.argv = exports.ask = exports.makeQuestion = exports.inqTypes = void 0;
/** CLI Support for async scripts */
//const path = require("path");
const path_1 = __importDefault(require("path"));
//const cwd = process.cwd();
const lodash_1 = __importDefault(require("lodash"));
const dotenv = __importStar(require("dotenv"));
const index_js_1 = require("./index.js");
//import  dotenv  from 'dotenv';
//@ts-ignore
dotenv.config(path_1.default.join(index_js_1.cwd, ".env"));
//const inquirer = require("inquirer");
const inquirer_1 = __importDefault(require("inquirer"));
exports.inqTypes = ['input', 'number', 'confirm', 'list', 'rawlist', ' expand', 'checkbox', 'password', 'editor'];
/**
 * Makes a single inquirer question
 */
function makeQuestion(message, { name = '', type = '', def = null, choices = [] }) {
    if (!exports.inqTypes.includes(type)) {
        throw new Error(`Invalid inquirer question type [${type}]`);
    }
    if (!name) {
        name = lodash_1.default.uniqueId('inc_name_');
    }
    if (!type) {
        if (choices.length) {
            type = 'checkbox';
        }
        else {
            type = 'input';
        }
    }
    return { message, type, default: def, choices, name, };
}
exports.makeQuestion = makeQuestion;
/**
 * Uses inquirer for one question, and answer
 *

 */
async function ask(msg, { name = '', type = '', def = null, choices = [] } = {}) {
    if (!name) {
        name = lodash_1.default.uniqueId('inc_name_');
    }
    if (!type) {
        if (choices.length) {
            type = 'checkbox';
        }
        else {
            type = 'input';
        }
    }
    let qArr = [makeQuestion(msg, { name, type, def, choices })];
    let answers = await inquirer_1.default.prompt(qArr);
    let answer = answers[name];
    return answer;
}
exports.ask = ask;
/*
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
*/
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const pk_ts_common_lib_1 = require("pk-ts-common-lib");
exports.argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv)).argv;
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
async function runCli(fncs, env) {
    console.log("Entering runCli");
    let largv = exports.argv;
    const args = largv._;
    delete largv._; //The rest is an object
    delete largv.$0;
    largv = (0, pk_ts_common_lib_1.trueVal)(largv);
    let tofs = typeof fncs;
    let params;
    let cmd;
    if (tofs === "object") {
        cmd = args[0];
        params = args.slice(1);
    }
    else if (tofs === "function") {
        params = args;
    }
    else {
        console.log(`What to do with fncs type: ${tofs}?`);
        process.exit();
    }
    if (typeof fncs === "object") {
        console.log(`\n\nAbout to await run ${cmd} in environment: [${env}] with params:`, { params, largv });
        let fkeys = Object.keys(fncs);
        if (!fkeys.includes(cmd)) {
            console.log(`"${cmd}" is not a test function - did you mean one of:`, fkeys);
            process.exit();
        }
        try {
            let res = await fncs[cmd](...params, largv);
        }
        catch (err) {
            console.error(`There was an error: ${err.message}`, { err });
        }
    }
    else if (typeof fncs === "function") {
        console.log("Running single function w. params:", { params, largv });
        let res = await fncs(...params, largv);
        console.log("Completed Run");
    }
    else {
        console.log("Don't know what to run!");
    }
    process.exit();
}
exports.runCli = runCli;
//# sourceMappingURL=cliSupport.js.map