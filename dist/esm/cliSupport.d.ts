export declare const inqTypes: string[];
/**
 * Makes a single inquirer question
 */
export declare function makeQuestion(message: string, { name, type, def, choices }: {
    name?: string;
    type?: string;
    def?: any;
    choices?: any[];
}): {
    message: string;
    type: string;
    default: any;
    choices: any[];
    name: string;
};
/**
 * Uses inquirer for one question, and answer
 *

 */
export declare function ask(msg: string, { name, type, def, choices }?: {
    name?: string;
    type?: string;
    def?: any;
    choices?: any[];
}): Promise<any>;
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

Call from cli with "ts-node <scripts/name.ts testName arg1 arg2"

 */
export declare function runCli(fncs: any, env?: any): Promise<void>;
