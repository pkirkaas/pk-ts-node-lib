/** Init shared by MongoQP-api & MongoQP-client */
//export * from './lib/json5-decycle.js';
//export * from './lib/json5-decycle.js';
//import { decycle, retrocycle, extend }
export * from "./lib/json-decyle-3.js";
//@ts-ignore
Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
};
export * from './common-operations.js';
export * from './tag-classes.js';
export * from './object-utils.js';
export * from './util-classes.js';
export * from './axios-init.js';
//# sourceMappingURL=index.js.map