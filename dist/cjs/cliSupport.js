/** CLI Support for async scripts */
import path from "path";
import { stdin as input, stdout as output } from 'node:process';
import * as readline from 'node:readline/promises';
import _ from "lodash";
import * as dotenv from 'dotenv';
import { cwd } from './index.js';
import { PkError, getProps, } from 'pk-ts-common-lib';
//@ts-ignore
dotenv.config(path.join(cwd, ".env"));
export function envInit(envPath = ".env") {
    //@ts-ignore
    dotenv.config(path.join(cwd, envPath));
}
envInit();
/**
 * Interactive CLI function to dynamically explore an object & properties
 * JS Objects can have cyclical references/properties - so can't just dump them.
 *
 * @param obj:any - any value to explore.
 */
export async function objectExplorer(obj, ppath) {
    let props = await getProps(obj, true);
    console.log(`objProps:`, { props });
}
// Simplified "inquirer" interface using "ask" with defaults (below)
// For full details, see https://www.npmjs.com/package/inquirer
// Should only need the async function "ask"
// TODO: Update to https://www.npmjs.com/package/@inquirer/prompts
import inquirer from "inquirer";
export const inqTypes = ['input', 'number', 'confirm', 'list', 'rawlist', ' expand', 'checkbox', 'password', 'editor'];
/**
 * Makes a single inquirer question JS Object, for use in "ask", below
 * NOTE: type 'list' returns a SINGLE value from the list, 'checkbox' returns array of selected values
 * NOTE: 'default' for a 'list' can be either the value or the array index.
 */
export function makeQuestion(message, { name = '', type = '', def = null, choices = [], pageSize = 40 }) {
    if (!inqTypes.includes(type)) {
        throw new Error(`Invalid inquirer question type [${type}]`);
    }
    if (!name) {
        name = _.uniqueId('inc_name_');
    }
    if (!type) {
        if (choices.length) {
            type = 'list';
            pageSize = Math.min(choices.length, pageSize);
        }
        else {
            type = 'input';
        }
    }
    return { message, type, default: def, choices, name, pageSize };
}
/**
 * Uses inquirer for one question, and answer
 * Real inquirer accepts an ARRAY of question objects in a single argument, & returns an object of answers keyed by 'name'
 * "ask" takes some parameters & returns a single answer
 *
 * @param string msg - the message to show/prompt
 * @param object w. optional keys/values:
 *   name: string - the name to use for the answer - not required since only one answer per ask
 *   type: one of the incTypes above. If not defined, defaults to string input, unless the choices array exists
 *      if type==='list', single item returned, if 'checkbox', array of selected items returned.
 *   def: string|int - default, if any. If type === 'list', default can be value or inde4x
 *   choices: opt array - type empty & choices NOT empty, type changes to "list"
 *   **choices** can be a simple array of strings, or an array of objects with 'name' & 'value' properties - name is what is displayed, value is the value returned
 *
 * @return "answer" value -
 */
export async function ask(msg, { name = '', type = '', def = null, choices = [], pageSize = 40 } = {}) {
    if (!name) {
        name = _.uniqueId('inc_name_');
    }
    if (!type) {
        if (choices.length) {
            type = 'list';
        }
        else {
            type = 'input';
        }
    }
    let qArr = [makeQuestion(msg, { name, type, def, choices, pageSize })];
    //@ts-ignore
    let answers = await inquirer.prompt(qArr);
    let answer = answers[name];
    return answer;
}
export async function multilineInput(prompt) {
    if (!prompt) {
        prompt = 'Enter text: ';
    }
    prompt += ' ("exit" or <Ctl-D> to finish)';
    const rl = readline.createInterface({ input, output, terminal: true, });
    let lines = [];
    let exits = ['exit', 'quit', 'q', '.', 'bye', 'done',];
    console.log(prompt);
    return new Promise((resolve, reject) => {
        rl.on('line', (line) => {
            if (exits.includes(line.trim())) {
                rl.close();
                return resolve(lines.join('\n'));
            }
            lines.push(line);
        });
        rl.on('close', () => {
            resolve(lines.join('\n')); // Handle Ctrl-D here
        });
        rl.on('error', (err) => {
            reject(err);
        });
    });
}
export async function askConfirm(cMsg = 'Do It?') {
    console.log(`Run Task: [${cMsg}]`);
    let cont = await ask("Continue? (Yy)");
    if (cont.toLowerCase() !== 'y') {
        console.log("Aborting");
        throw new PkError(`User aborted`);
    }
    return true;
}
/*
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
*/
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { trueVal } from 'pk-ts-common-lib';
/**
 * Parse CLI arguments, return as object
 * argv._ - array of CLI args
 * argv.[optkey] - value of optkey
 */
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

Run from cli with:
`node <script-path> <cmd> ai ts --dog=cat --tiger=lion`
Will call `<cmd>('ai', 'ts', {dog:"cat", tiger:"lion"});`


 */
export async function runCli(fncs, env) {
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
        cmd = args[0] || 'default';
        params = args.slice(1);
    }
    else if (tofs === "function") {
        params = args;
    }
    else {
        console.log(`What to do with fncs type: ${tofs}?`);
        process.exit();
    }
    if (largv) { //Add to params
        params.push(largv);
    }
    if (typeof fncs === "object") {
        console.log(`\n\nAbout to await run ${cmd} in environment: [${env}] with params:`, { params, });
        let fkeys = Object.keys(fncs);
        if (!fkeys.includes(cmd)) {
            console.log(`"${cmd}" is not a test function - did you mean one of:`, fkeys);
            process.exit();
        }
        try {
            let res = await fncs[cmd](...params);
        }
        catch (err) {
            console.error(`Exception in 'runCli' for cmd: [${cmd}], params:`, params, `Err Message: [${err.message}]`, { err });
        }
    }
    else if (typeof fncs === "function") {
        console.log("Running single function w. params:", { params, });
        try {
            let res = await fncs(...params);
            console.log("Completed Run");
        }
        catch (err) {
            console.error(`Exception in 'runCli' for FUNCTION w. params:`, params, `Err Message: [${err.message}]`, { err });
        }
    }
    else {
        console.log("Don't know what to run!");
    }
    process.exit();
}
//# sourceMappingURL=cliSupport.js.map