export * from   'pk-ts-common-lib';
export * from './node-operations.js';
export * from './files.js';
export * from './cliSupport.js';
export * from './configUtils.js';
export * from './sass-support.js';
import { isEmpty, isSimpleObject, trueVal, typeOf, isPrimitive } from 'pk-ts-common-lib';

/*

let tstObj = { akey: "aval", anotherKey: "anotherVal" };
let tstSmp = isSimpleObject(tstObj);
console.log({ tstObj, tstSmp });
*/