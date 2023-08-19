"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const child_process_1 = require("child_process");
const util_1 = __importDefault(require("util"));
util_1.default.inspect.defaultOptions.maxArrayLength = null;
util_1.default.inspect.defaultOptions.depth = null;
util_1.default.inspect.defaultOptions.breakLength = 200;
util_1.default.inspect.defaultOptions.maxStringLength = null;
util_1.default.inspect.defaultOptions.depth = null;
util_1.default.inspect.defaultOptions.colors = true;
let env = process.env;
function tstSpawn(cmd, opts = {}, args = []) {
    let res = (0, child_process_1.spawnSync)(cmd, args, opts);
    if (res.error) {
        throw res.error;
    }
    if (res.stderr.length) {
        throw new Error(res.stderr.toString());
    }
    return res.stdout.toString();
}
function tstExec(cmd, opts = {}) {
    return (0, child_process_1.execSync)(cmd, opts).toString();
}
let gbash = 'C:\\Program Files\\Git\\usr\\bin\\bash.exe';
let tsts = {
    dirnsh: {
        cmd: "dir", opts: {
            shell: false,
        },
    },
    dirsh: {
        cmd: "dir", opts: {
            shell: true,
        },
    },
    /*
    dirbsh: {
        cmd: "dir", opts: {
            shell: gbash,
        },
    },
    bdbgbbsh: {
        cmd: "bashbug", opts: {
            shell: 'bash',
        },
    },
    */
    dirbbsh: {
        cmd: "dir", opts: {
            shell: 'bash',
        },
    },
    bshpwd: {
        cmd: "pwd", opts: {
            shell: 'bash',
        },
    },
};
//let res = { platform: os.platform(), release: os.release(), type: os.type(), version: os.version(), };
let osType = os_1.default.type();
//console.log(osType, "mjs", { env });
//process.env.COMSPEC = gbash;
function runTsts(ltsts = tsts) {
    for (let tst in ltsts) {
        let { cmd, opts } = ltsts[tst];
        let spawnRes = tstSpawn(cmd, opts);
        let execRes = tstExec(cmd, opts);
        console.log({ tst, cmd, opts, spawnRes, execRes });
    }
}
runTsts();
//# sourceMappingURL=tstOs.mjs.map