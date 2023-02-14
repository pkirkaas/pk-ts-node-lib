export * from   'pk-ts-common-lib';
export * from './cliSupport';
export * from './node-operations';
export * from './files';
export * from './configUtils';
import { isEmpty, isSimpleObject, trueVal, typeOf, isPrimitive } from 'pk-ts-common-lib';
/*

let tstObj = { akey: "aval", anotherKey: "anotherVal" };
let tstSmp = isSimpleObject(tstObj);
console.log({ tstObj, tstSmp });
*/