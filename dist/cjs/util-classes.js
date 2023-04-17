"use strict";
/**
    * Experimental implementation of Various utility classes
    * March 2023
    * Paul Kirkaas
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.PkError = void 0;
/**
 * Initial placeholder for generic error class with more details than "Error"
 */
class PkError extends Error {
    constructor(msg, ...params) {
        let opts = null;
        if (Array.isArray(params) && params.length) {
            opts = params[0];
        }
        // JS Error constructor only uses opts if is an object with key 'cause'
        super(msg, opts);
        if (params.length) {
            this.details = params[0];
            params.shift();
        }
        if (params.length) {
            this.extra = params;
        }
    }
}
exports.PkError = PkError;
//# sourceMappingURL=util-classes.js.map