"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showExp = exports.anexp = void 0;
exports.anexp = { tst: 'exported', obj: 'object' };
function showExp() {
    console.log(`Using package.json exports! anexp:`, { anexp: exports.anexp });
}
exports.showExp = showExp;
;
//# sourceMappingURL=tst-exports.js.map