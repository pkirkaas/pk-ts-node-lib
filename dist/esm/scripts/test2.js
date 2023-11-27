import { isJson5Str, JSON5Stringify,
//JSON5
 } from '../index.js';
import util from 'util';
//import jsonDecycle from "json-decycle";
//const { decycle, retrocycle, extend } = jsonDecycle;
//import { decycle, retrocycle, extend } from "../lib/json-decycle-3.js";
//import { decycle, retrocycle, extend } from "json-decycle";
//import JSON5 from 'json5';
util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.depth = null;
util.inspect.defaultOptions.breakLength = 200;
var cycled = {
    foo: {},
    bar: {},
};
cycled.foo.bar = cycled.foo;
cycled.bar.foo = cycled.bar;
/*
*/
/*
*/
//let cycledC5 = JSON5Stringify(cycled);
//let cycledJ5 = JSON5.stringify(cycled);
// @ts-ignore
let cycledCS = JSON5Stringify(cycled);
let isJ5strT = isJson5Str(cycledCS);
let isJ5strF = isJson5Str("Not a j5 str");
//let cycledCS = JSON5.stringify(cycled, decycle());
// @ts-ignore
//let cycledCC = JSON5.decycle(cycled);
console.log({
    //	cycledJ5,
    cycledCS,
    isJ5strT,
    isJ5strF,
    //	cycledCC,
});
//# sourceMappingURL=test2.js.map