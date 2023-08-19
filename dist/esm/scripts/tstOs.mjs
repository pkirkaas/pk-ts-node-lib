import os from "os";
import { execSync, spawnSync } from "child_process";
import util from 'util';
util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.depth = null;
util.inspect.defaultOptions.breakLength = 200;
util.inspect.defaultOptions.maxStringLength = null;
util.inspect.defaultOptions.depth = null;
util.inspect.defaultOptions.colors = true;
let env = process.env;
function tstSpawn(cmd, opts = {}, args = []) {
    let res = spawnSync(cmd, args, opts);
    if (res.error) {
        throw res.error;
    }
    if (res.stderr.length) {
        throw new Error(res.stderr.toString());
    }
    return res.stdout.toString();
}
function tstExec(cmd, opts = {}) {
    return execSync(cmd, opts).toString();
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
let osType = os.type();
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