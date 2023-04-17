"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../index.js");
const lodash_1 = __importDefault(require("lodash"));
const util_1 = __importDefault(require("util"));
util_1.default.inspect.defaultOptions.maxArrayLength = null;
util_1.default.inspect.defaultOptions.depth = null;
util_1.default.inspect.defaultOptions.breakLength = 200;
console.log('In test.ts...');
function camelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}
function camelize(str) {
    return str.replace(/\W+(.)/g, function (match, chr) {
        return chr.toUpperCase();
    });
}
let snakes = [" dog-cat ", ' "tiger-lion" ', " ' horse-cow '",];
let camels = [" dogMouse ", ' "Dinosaur King" ', " ' NeverKnown '",];
let strs = ['tag', 'donkey', 'animal', 'plant'];
/*
for (let str of strs) {
    let strpd = stripStray(str);
    let strpp = stripStray(strpd);
    let camel = toCamelCase(strpp);
    console.log({ str, strpd, strpp, camel });
};
*/
let tstObjs = {
    camelize, camels, empt: {}, Date, Math
};
for (let key in tstObjs) {
    let val = tstObjs[key];
    let toVal = (0, index_js_1.typeOf)(val);
    let toval = typeof val;
    let objLike = lodash_1.default.isObjectLike(val);
    let isemp = (0, index_js_1.isEmpty)(val);
    let isobj = (0, index_js_1.isObject)(val);
    console.log({ key, toVal, toval, objLike, isobj, isemp });
}
/*
console.log({ snakes, camels });
for (let snake of snakes) {
    let str = stripStray(snake);
    let cc = camelCase(str);
    let cmz = camelize(str);
    let myRes = toCamelCase(snake);
    console.log({ snake, str, cc, cmz, myRes });
}

for (let camel of camels) {
    let stripped = stripStray(camel);
    //let cc = camelCase(str);
    //let cmz = camelize(str);
    let snaked = toSnakeCase(camel);
    console.log({  camel, stripped, snaked });
}
*/
let tstArr = ['dog', 'cat', 'horse', 'donky', 7, 12, { some: 'obj' }, 'today'];
class Organ {
    constructor(age) {
        this.age = age;
    }
}
;
class Animal extends Organ {
    constructor(age, nick) {
        super(age);
        this.nick = nick;
    }
}
;
class Mammal extends Animal {
}
class Dog extends Mammal {
    constructor(age, nick, breed, owner) {
        super(age, nick);
        this.breed = breed;
        this.owner = owner;
    }
}
function tstFnNames(arg) {
    console.log({ arg });
}
let aDog = new Dog(22, 'buck', 'mutt', 'daddy');
function tstPropsY() {
    let biProps = (0, index_js_1.getAllBuiltInProps)();
    console.log({ biProps });
}
function tstProps() {
    let anErr = new index_js_1.PkError('tstErr');
    let bres = {
        aDog,
        aDogOI: (0, index_js_1.objInfo)(aDog),
        DogOI: (0, index_js_1.objInfo)(Dog),
        inspP: (0, index_js_1.objInfo)(anErr, 'dv'),
        anErr: (0, index_js_1.objInfo)(anErr),
        PkError: (0, index_js_1.objInfo)(index_js_1.PkError),
        isEmpty: (0, index_js_1.objInfo)(index_js_1.isEmpty),
        emptyObj: (0, index_js_1.objInfo)({}),
        emptyArr: (0, index_js_1.objInfo)([]),
        string: (0, index_js_1.objInfo)(' '),
        //aDogPChain: getPrototypeChain(aDog),
        //anErrPChain: getPrototypeChain(anErr),
        aDogCS: (0, index_js_1.classStack)(aDog),
        //DogPChain: getPrototypeChain(Dog),
        DogCS: (0, index_js_1.classStack)(Dog),
        /*
        inspP: allProps(anErr, 'dv'),
        anErr: getObjDets(anErr),
        PkError: getObjDets(PkError),
        isEmpty: getObjDets(isEmpty),
        emptyObj: getObjDets({}),
        emptyArr: getObjDets([]),
        string: getObjDets(' '),
        aDogPChain: getPrototypeChain(aDog),
        //anErrPChain: getPrototypeChain(anErr),
        aDogCS: classStack(aDog),
        //DogPChain: getPrototypeChain(Dog),
        DogCS: classStack(Dog),
        //	aDogCChain: getConstructorChain(aDog),
        */
    };
    /*
    let res = {
        anErr: { props: allProps(anErr), type: typeof anErr },
        PkErrorClass: { props: allProps(PkError), type: typeof PkError },
        //emptyObj: allProps({}),
        simpleObj: allProps({ d: 'cat' }),
        emptyArr: allProps([]),
        //smallArr: allProps([1, 2, 3]),
        isEmptyFnc: allProps(isEmpty),
        //null:allProps(null),
    }
    */
    console.log({ bres });
}
;
//tstProps();
/*
let tstDtArgs = { null: null, str1: '2023-12-01' };
let res: GenObj = {};
for (let key in tstDtArgs) {
     let orig = tstDtArgs[key];
     let pkTDRes
    res[key] = {
        orig,
        pkTDRes: pkToDate(orig),
        dtFmtShort: dtFmt('short', orig),
        dtFmtDT: dtFmt('dt', orig),
        dtFmtDTs: dtFmt('dts', orig),
        dtFmtTs: dtFmt('ts', orig),
    }
}
let dtE = new Date();
let dtN = new Date(null);
console.log('todate res:', { res, dtE, dtN });
let tobj = { a: 8 };
let isDist = false;
let j5 = JSON5.stringify(tobj);
let to = typeOf(tobj);
let toJ = typeOf(JSON);
let toJ5 = typeOf(JSON5);
let arr1 = ['a', 'b', 'c'];
let arr2 = ['a', 'b'];
let asub = isSubset(arr2, arr1);
let tagObj = new TagObj('myData', 'theTag');
*/
/*
function valIsNaN(arg: any) {
    return arg !== arg;
}

let tests = { int:5, True:true, False: false, str5:"5", str:"dog", float:2.3, floatStr:"4.7", null:null, emptyStr:'', };
//let (res = tests.map((el) => filterInt(el));
for (let key in tests) {
    let orig = tests[key];
    let fint = filterInt(orig);
    let pInt = parseInt(orig);
    let nanish = Number.isNaN(pInt);
    let vIsNaN = valIsNaN(pInt);
    tests[key] = { orig, fint, pInt, nanish, vIsNaN };
}
console.log({ tests });





console.log("Testing tests", { tobj, to, j5, jsondecycle, toJ5, toJ, asub, tagObj });

let anerr = new PkError('Some Err Msg', { dog: 3, cat: 'What?' }, 'something', 2, 8);

throw anerr;

let a1 = [1, 3, 5, 7];
let a2 = [1, 'toby', 9, 7];
let a3 = [5, 'toby', 'tomorrow', 7];
let u = uniqueVals(a1, a2, a3);
console.log({ u });

let tobj1 = {
    a: 1,
    b: { dog: 5, cat: 'acat', no:9,},
    c: [5, 7, 'tiger',],
};

let tobj2 = {
    a: 'oprim',
    b: { dog: 7, cat: 22, },
    c: [ 9, 22, 'lion', 5],
}

let dm = deepMeld(tobj1, tobj2);

console.log({ dm });
*/ 
//# sourceMappingURL=test.js.map