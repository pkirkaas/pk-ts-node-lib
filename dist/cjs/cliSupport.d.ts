export declare function envInit(envPath?: string): void;
/**
 * Interactive CLI function to dynamically explore an object & properties
 * JS Objects can have cyclical references/properties - so can't just dump them.
 *
 * @param obj:any - any value to explore.
 */
export declare function objectExplorer(obj: any, ppath: string[]): Promise<void>;
export declare const inqTypes: string[];
/**
 * Makes a single inquirer question JS Object, for use in "ask", below
 * NOTE: type 'list' returns a SINGLE value from the list, 'checkbox' returns array of selected values
 * NOTE: 'default' for a 'list' can be either the value or the array index.
 */
export declare function makeQuestion(message: string, { name, type, def, choices, pageSize }: {
    name?: string;
    type?: string;
    def?: any;
    choices?: any[];
    pageSize?: number;
}): {
    message: string;
    type: string;
    default: any;
    choices: any[];
    name: string;
    pageSize: number;
};
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
export declare function ask(msg: string, { name, type, def, choices, pageSize }?: {
    name?: string;
    type?: string;
    def?: any;
    choices?: any[];
    pageSize?: number;
}): Promise<any>;
export declare function multiLineInput(prompt?: string): Promise<string>;
export declare function askConfirm(cMsg?: string): Promise<boolean>;
/**
 * Parse CLI arguments, return as object
 * argv._ - array of CLI args
 * argv.[optkey] - value of optkey
 */
export declare const argv: any;
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
export declare function runCli(fncs: any, env?: any): Promise<void>;
//# sourceMappingURL=cliSupport.d.ts.map