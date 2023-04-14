"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sassMapStringToObj = exports.sassMapStringToJson = void 0;
/**
 * Almost never used - but IF debugging SASS/SCSS, can use sass-export to output sass variables as JSON -
 * but if the map keys are integers, JSON & JSON5 don't like it. So need to convert the sass-export json string
 * to something parsable.
 */
const index_js_1 = require("./index.js");
function sassMapStringToJson(str) {
    let lcVal = str.replaceAll('(', '{').replaceAll(')', '}');
    //let keyMatch = /:([^}]*)}/g;
    let valRe1 = /:\s*([^:},]*)}/g;
    // MIGHT HAVE TO RESTORE THE BELOW:
    //let valRe2 = /:\s*([^:},]*),/g;
    //NEW VERSION - TO PREVENT quoting obj val after :
    let valRe2 = /:\s*([^:},{]*),/g;
    let keyRe1 = /{\s*([0-9]+[^:}]*):/g;
    let keyRe2 = /,\s*([0-9]+[^:}]*):/g;
    lcVal = lcVal.replaceAll('-', '_');
    lcVal = lcVal.replaceAll(valRe1, ':"$1"}');
    lcVal = lcVal.replaceAll(valRe2, ':"$1",');
    lcVal = lcVal.replaceAll(keyRe1, '{"$1":');
    lcVal = lcVal.replaceAll(keyRe2, ',"$1":');
    return lcVal;
}
exports.sassMapStringToJson = sassMapStringToJson;
function sassMapStringToObj(str) {
    let json5str = sassMapStringToJson(str);
    let obj = (0, index_js_1.JSON5Parse)(json5str);
    return obj;
}
exports.sassMapStringToObj = sassMapStringToObj;
//# sourceMappingURL=sass-support.js.map