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
/** Init shared by MongoQP-api & MongoQP-client */
__exportStar(require("./lib/json-decycle.js"), exports);
//@ts-ignore
Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
};
__exportStar(require("./common-operations.js"), exports);
__exportStar(require("./tag-classes.js"), exports);
__exportStar(require("./object-utils.js"), exports);
__exportStar(require("./util-classes.js"), exports);
//# sourceMappingURL=index.js.map