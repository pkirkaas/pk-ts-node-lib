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
/**
 * Multi-line input, similar to "ask" above, but returns a string of all lines entered. End input with <Ctl-D>
 */
export declare function multiAsk(prompt?: string): Promise<string>;
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
export declare function getArrArgs(args: any[]): any[];
/**
 * Return object arg, if any - else empty object or null
 * @param defObj: undefined, empty obj, or default object
 * @return object arg, if any, w. default, if any, - else empty object or null
 */
export declare function getObjArg(args: any[], defObj?: any): any;
/**
 * Return object {arr, obj, opts} w. array args & obj args -
 * opts same as obj, EXCEPT if no default & no obj, opts is '{}' empty obj.
 */
export declare function parseArgs(args: any[], defObj?: any): any;
export declare function runCli(fncs: any, env?: any): Promise<void>;
//# sourceMappingURL=cliSupport.d.ts.map