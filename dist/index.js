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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("pk-ts-common-lib"), exports);
__exportStar(require("./cliSupport"), exports);
__exportStar(require("./node-operations"), exports);
__exportStar(require("./files"), exports);
__exportStar(require("./configUtils"), exports);
/*

let tstObj = { akey: "aval", anotherKey: "anotherVal" };
let tstSmp = isSimpleObject(tstObj);
console.log({ tstObj, tstSmp });
*/ 
//# sourceMappingURL=index.js.map