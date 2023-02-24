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
