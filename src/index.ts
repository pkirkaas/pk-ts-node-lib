import { isEmpty, isSimpleObject, trueVal, typeOf, isPrimitive } from 'pk-ts-common-lib';

let tstObj = { akey: "aval", anotherKey: "anotherVal" };
let tstSmp = isSimpleObject(tstObj);
console.log({ tstObj, tstSmp });