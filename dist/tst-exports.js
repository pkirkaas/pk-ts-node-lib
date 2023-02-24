"use strict";
exports.__esModule = true;
exports.showExp = exports.anexp = void 0;
exports.anexp = { tst: 'exported', obj: 'object' };
function showExp() {
    console.log("Using package.json exports! anexp:", { anexp: exports.anexp });
}
exports.showExp = showExp;
;
