"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extend = exports.retrocycle = exports.decycle = void 0;
const isObject = (value) => typeof value === 'object'
    && value != null
    && !(value instanceof Boolean)
    && !(value instanceof Date)
    && !(value instanceof Number)
    && !(value instanceof RegExp)
    && !(value instanceof String);
const toPointer = (parts) => '#' + parts.map(part => String(part).replace(/~/g, '~0').replace(/\//g, '~1')).join('/');
const decycle = () => {
    const paths = new WeakMap();
    return function replacer(key, value) {
        var _a;
        if (key !== '$ref' && isObject(value)) {
            const seen = paths.has(value);
            if (seen) {
                return { $ref: toPointer(paths.get(value)) };
            }
            else {
                paths.set(value, [...(_a = paths.get(this)) !== null && _a !== void 0 ? _a : [], key]);
            }
        }
        return value;
    };
};
exports.decycle = decycle;
function retrocycle() {
    const parents = new WeakMap();
    const keys = new WeakMap();
    const refs = new Set();
    function dereference(ref) {
        const parts = ref.$ref.slice(1).split('/');
        let key, parent, value = this;
        for (var i = 0; i < parts.length; i++) {
            key = parts[i].replace(/~1/g, '/').replace(/~0/g, '~');
            value = value[key];
        }
        parent = parents.get(ref);
        parent[keys.get(ref)] = value;
    }
    return function reviver(key, value) {
        if (key === '$ref') {
            refs.add(this);
        }
        else if (isObject(value)) {
            var isRoot = key === '' && Object.keys(this).length === 1;
            if (isRoot) {
                refs.forEach(dereference, this);
            }
            else {
                parents.set(value, this);
                keys.set(value, key);
            }
        }
        return value;
    };
}
exports.retrocycle = retrocycle;
const extend = (JSON) => {
    return Object.defineProperties(JSON, {
        decycle: {
            value: (object, space) => JSON.stringify(object, (0, exports.decycle)(), space)
        },
        retrocycle: {
            value: (s) => JSON.parse(s, retrocycle())
        }
    });
};
exports.extend = extend;
//# sourceMappingURL=json-decycle.js.map