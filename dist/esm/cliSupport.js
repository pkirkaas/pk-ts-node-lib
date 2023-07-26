var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/** CLI Support for async scripts */
//const path = require("path");
import path from "path";
//const cwd = process.cwd();
import _ from "lodash";
import * as dotenv from 'dotenv';
import { cwd } from './index.js';
//import  dotenv  from 'dotenv';
//@ts-ignore
dotenv.config(path.join(cwd, ".env"));
//const inquirer = require("inquirer");
import inquirer from "inquirer";
export const inqTypes = ['input', 'number', 'confirm', 'list', 'rawlist', ' expand', 'checkbox', 'password', 'editor'];
/**
 * Makes a single inquirer question
 */
export function makeQuestion(message, { name = '', type = '', def = null, choices = [] }) {
    if (!inqTypes.includes(type)) {
        throw new Error(`Invalid inquirer question type [${type}]`);
    }
    if (!name) {
        name = _.uniqueId('inc_name_');
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
/**
 * Uses inquirer for one question, and answer
 *

 */
export function ask(msg, { name = '', type = '', def = null, choices = [] } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!name) {
            name = _.uniqueId('inc_name_');
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
        let answers = yield inquirer.prompt(qArr);
        let answer = answers[name];
        return answer;
    });
}
/*
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
*/
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { trueVal } from 'pk-ts-common-lib';
export const argv = yargs(hideBin(process.argv)).argv;
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
export function runCli(fncs, env) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Entering runCli");
        let largv = argv;
        const args = largv._;
        delete largv._; //The rest is an object
        delete largv.$0;
        largv = trueVal(largv);
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
                let res = yield fncs[cmd](...params, largv);
            }
            catch (err) {
                console.error(`There was an error: ${err.message}`, { err });
            }
        }
        else if (typeof fncs === "function") {
            console.log("Running single function w. params:", { params, largv });
            let res = yield fncs(...params, largv);
            console.log("Completed Run");
        }
        else {
            console.log("Don't know what to run!");
        }
        process.exit();
    });
}
//# sourceMappingURL=cliSupport.js.map