"use strict";
/**
 * Experimental implementation of specialized object utilities - like deep merge, with arrays combined
 * March 2023
 * Paul Kirkaas
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepMeld = void 0;
const index_js_1 = require("./index.js");
function deepMeld(...objs) {
    let melded = {};
    for (let obj of objs) {
        if (!(0, index_js_1.isObject)(obj)) {
            let too = (0, index_js_1.typeOf)(obj);
            let msg = `Argument to deepMeld is not an object: Type: [${too}]`;
            throw new index_js_1.PkError(msg, { obj });
        }
        for (let key in obj) {
            let val = obj[key];
            if (!(key in melded) || (0, index_js_1.isPrimitive)(val)) {
                melded[key] = val;
                continue;
            }
            let mval = melded[key]; // How to meld depending on type
            if (Array.isArray(val) && Array.isArray(mval)) {
                melded[key] = (0, index_js_1.uniqueVals)(mval, val);
                continue;
            }
            if ((0, index_js_1.isObject)(val) && (0, index_js_1.isObject)(mval)) {
                melded[key] = deepMeld(mval, val);
                continue;
            }
            melded[key] = val;
        }
    }
    return melded;
}
exports.deepMeld = deepMeld;
//# sourceMappingURL=object-utils.js.map