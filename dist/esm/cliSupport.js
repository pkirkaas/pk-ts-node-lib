/** CLI Support for async scripts */
// NPM Imports
import path from "path";
import { stdin as input, stdout as output } from 'node:process';
import * as readline from 'node:readline/promises';
import chalk from "chalk";
import * as dotenv from 'dotenv';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as inq from '@inquirer/prompts';
// PK Lib Imports
import { PkError, getProps, isSimpleObject, trueVal, } from 'pk-ts-common-lib';
// Local Imports
import { cwd, setInspectLevels, } from './index.js';
setInspectLevels();
//@ts-ignore
// Covered w. envInit()?
//dotenv.config(path.join(cwd, ".env"));
/**
 * Parse CLI arguments, return as object
 * argv._ - array of CLI args
 * argv.[optkey] - value of optkey
 */
export const argv = yargs(hideBin(process.argv)).argv;
export function envInit(envPath = ".env") {
    //@ts-ignore - why is this needed?
    dotenv.config({ path: path.join(cwd, envPath) });
}
envInit();
export const inqTypes = ['input', 'number', 'confirm', 'list', 'rawlist', ' expand', 'checkbox', 'password', 'editor', 'multi', 'multiline',];
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
/**
 * Makes a single inquirer question JS Object, for use in "ask", below
 * NOTE: type 'list' returns a SINGLE value from the list, 'checkbox' returns array of selected values
 * NOTE: 'default' for a 'list' can be either the value or the array index.
 */
/*
export function makeQuestion(message: string, { name = '', type = '', def = null, choices = [], pageSize = 40 }) {
    if (!inqTypes.includes(type)) {
        throw new Error(`Invalid inquirer question type [${type}]`);
    }
    if (!name) {
        name = _.uniqueId('inc_name_');
    }
    if (!type) {
        if (!isEmpty(choices)) {
            if (isSimpleObject(choices)) {
                let choiceArr = [];
                for (let name in choices) {
                    choiceArr.push({ name, value: choices[name] });
                }
                choices = choiceArr;
            }
        }
        if (choices.length) {
            type = 'list';
            pageSize = Math.min(choices.length, pageSize);
        } else {
            type = 'input';
        }
    }
    return { message, type, default: def, choices, name, pageSize };
}
    */
export const ask2types = [
    'editor', 'select', 'input', 'confirm', 'multi', 'checkbox',
    'expand', 'search', 'rawlist', 'number',
];
/**
 * Re-implement 'ask' with new inquirer prompts lib
 * Asks a CLI question of type
 * simplifies inquirer/prompts with defaults
 * If `choices` is a simple object keys:values, converts to choices array w. [{name:key, value:value}]
 * @param msg:string - the message to prompt
 * @param opts?:GenObj|any[] - parameters for prompt -
 *   if empty, prompt type is 'input'
 *   if array or GenObj w/o type key of ask2types, is 'choices' for 'select'
 *   else contains 'type' and params for type. If contains key 'choices', and no type, makes type select
 * @return answer
 */
export async function ask(message, opts) {
    try {
        if (opts && !Array.isArray(opts) && !isSimpleObject(opts)) {
            throw new PkError(`Invalid opts param:`, { opts });
        }
        // Experiment w. chalk styling
        message = chalk.red.bold(message);
        let inqObj = { message, };
        let type;
        let isChoices = (arg) => (Array.isArray(arg) ||
            (isSimpleObject(arg) && (!('choices' in arg) && (!('type' in arg) || !ask2types.includes(arg.type)))));
        let choicesAsArr = (arg) => Array.isArray(arg) ? arg : Object.keys(arg).map((name) => { return { name, value: arg[name] }; });
        if (!opts) {
            type = 'input';
        }
        else if (isChoices(opts)) { // Opts are choices, type is 'select'
            type = 'select';
            inqObj.choices = choicesAsArr(opts);
        }
        else if (isSimpleObject(opts)) { // General object 
            if (opts.choices) {
                inqObj.choices = choicesAsArr(opts.choices);
                delete opts.choices;
                type = opts.type || 'select';
            }
            else {
                type = opts.type || 'input';
            }
            delete opts.type;
            inqObj = { ...inqObj, ...opts };
            if (type === 'editor' && !inqObj.postfix) {
                inqObj.postfix = '.md';
            }
        }
        if (inqObj.choices && !inqObj.pageSize) {
            inqObj.pageSize = 40;
        }
        let answer;
        if (type === 'multi') {
            let answer = await multiAsk(message);
        }
        else {
            if (type === 'input') {
                inqObj.message += `('multi' or 'editor' to switch)`;
                //@ts-ignore
                answer = await inq.input(inqObj);
                if (!answer) {
                    //let toa = typeOf(answer);
                    //console.log(`In ask, type = 'input' - Falsy answer: toa: [${toa}]`, {answer});
                    //let conf = await ask('Sure you want to exit? ', { type: 'confirm', def: false });
                    let conf = await inq.confirm({ message: 'Sure you want to exit? ', default: false });
                    if (conf) {
                        return answer;
                    }
                    else {
                        //answer = await ask(origMsg, { type: 'input', def: def });
                        //@ts-ignore
                        answer = await await inq.input(inqObj);
                    }
                }
                if ((typeof answer === 'string') && answer) {
                    let trimmed = answer.trim();
                    if (trimmed === 'multi') {
                        answer = await multiAsk(message);
                    }
                    else if (trimmed === 'editor') {
                        answer = await inq.editor({ ...inqObj, message, postfix: '.md' });
                    }
                }
            }
            else {
                //console.log(`\n\nIn Ask2:`, {message, opts, type, inqObj},`\n\n`);
                answer = await inq[type](inqObj);
            }
            return answer;
        }
    }
    catch (e) {
        console.error(`Exception in 'ask':`, e);
        return null;
    }
}
/**
 * Multi-line input, similar to "ask" above, but returns a string of all lines entered. End input with <Ctl-D>
 */
export async function multiAsk(prompt) {
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
/**
 * Ask for confirmation, return true or false
 * @param string cMsg - the message to show/prompt
 * @param boolean def - default confirmation value (default = true)
 * @return boolean - true or false
 */
export async function askConfirm(cMsg = 'Do It?', def = true) {
    let answer = await ask(cMsg, { type: 'confirm', def });
    return answer;
}
export async function fsBrowse({ root }) {
    return 'testing';
}
/** Support for CLI commands & tests with ts-node
 * From a test script (test.ts) import runTest - define some test functions:
 *
import { runTest } from "../src";
import { ProductModel, TradingPartnerModel } from '../src';
const SSID = "613f4597f29dae35a2c9c3d4";
const fncs = {
    tstTst: async function (...args) {
        //args - array of str args, possibly w. GenObj at end
        console.log("In tstTst -2 ");
        let tp = await TradingPartnerModel.getDoc(SSID);
        let companyname = tp.companyname;
        console.log({ companyname });
    },
};
runTest(fncs,[cli_env]);

Run from cli with:
`node <script-path> <cmd> ai -abc wolf ts --dog=cat --tiger=lion`
Will call `<cmd>('ai', 'ts', {dog:"cat", tiger:"lion", a:true, b:true, c:"wolf" });`
*/
/**
 * For runCli argument parsing - ...args will be array of args, possibly empty, possibly w. GenObj at end
 * Usage:
 * test tstTst wolf ts --dog=cat --tiger=lion
 * // fncs - object of functions to call
 * fncs = {
        tstTst: async function (...args) {
            let {arr,obj} = parseArgs(args); //IMPORTANT - define fnc w. ...args, BUT call parseArgs(args)
            console.log({ arr, obj });
            // arr: ["wolf", "ts"], obj: { dog: 'cat', tiger: 'lion' }
        },
    };
    runTest(fncs,[cli_env]);
 */
export function getArrArgs(args) {
    return args.filter(a => !isSimpleObject(a));
}
/**
 * Return object arg, if any - else empty object or null
 * @param defObj: undefined, empty obj, or default object
 * @return object arg, if any, w. default, if any, - else empty object or null
 */
export function getObjArg(args, defObj) {
    /*
    if (isEmpty(args)) {
        return defObj;
    }
    */
    let lastArg = args.at(-1);
    if (isSimpleObject(lastArg)) {
        if (defObj) {
            return { ...defObj, ...lastArg };
        }
        else {
            return lastArg;
        }
    }
    return defObj;
}
/**
 * Parses CLI args into array of simple args and object of options
 * TODO: DOESN'T WORK outside of `runCli` - fix this!
 * TODO: consider adding breakup of optargs into array if comma separated
 * Usage:
 * cliFnc(...args) {
 *   let {arr, obj, opts} = parseArgs(args); //IMPORTANT - define fnc w. ...args, BUT call parseArgs(args)
 *   let firstArg = arr[0] || 'default';
 * ;
 *
 * If no regular args, can use default with
 * @param args: array of args
 * @param defObj?:object - default object to use if no obj arg
 * @return object {arr, obj, opts} w. array args & obj args -
 * opts same as obj, EXCEPT if no default & no obj, opts is '{}' empty obj.
 */
export function parseArgs(args, defObj) {
    let arr = getArrArgs(args);
    let obj = getObjArg(args, defObj);
    let opts = isSimpleObject(obj) ? obj : {};
    return { arr, obj, opts, };
}
export async function runCli(fncs, env) {
    console.log("Entering runCli");
    let pargv = process.argv;
    let largv = argv;
    //console.log(`debugging yargs:`, { largv, pargv, });
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
        let inEnv = env ? `, in env: [${env}] ` : "";
        console.log(`\n\nAbout to await run ${cmd} ${inEnv} with params:`, { params, });
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