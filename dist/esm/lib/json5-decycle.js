/**
 * Modified from original json-decycle to use JSON5, AND catch an enum error in
 * extend -   Invalid enum value: toJSON5
 * export const extend = (JSON: JSON) => {
  try {
    return Object.defineProperties(JSON, {
      decycle: {
        value: (object: any, space: string | number): string => JSON.stringify(object, decycle(), space)
      },
      retrocycle: {
        value: (s: string): any => JSON.parse(s, retrocycle())
      }
    })
 */
const isObject = (value) => typeof value === 'object'
    && value != null
    && !(value instanceof Boolean)
    && !(value instanceof Date)
    && !(value instanceof Number)
    && !(value instanceof RegExp)
    && !(value instanceof String);
const toPointer = (parts) => '#' + parts.map(part => String(part).replace(/~/g, '~0').replace(/\//g, '~1')).join('/');
export const decycle = () => {
    const paths = new WeakMap();
    return function replacer(key, value) {
        if (key !== '$ref' && isObject(value)) {
            const seen = paths.has(value);
            if (seen) {
                return { $ref: toPointer(paths.get(value)) };
            }
            else {
                paths.set(value, [...paths.get(this) ?? [], key]);
            }
        }
        return value;
    };
};
export function retrocycle() {
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
export const extend = (JSON5) => {
    try {
        return Object.defineProperties(JSON5, {
            decycle: {
                value: (object, space) => JSON5.stringify(object, decycle(), space)
            },
            retrocycle: {
                value: (s) => JSON5.parse(s, retrocycle())
            }
        });
    }
    catch (e) {
        //TODO: FIX THIS
        //console.error(`retrocycle & decycle already defined on JSON - Exception:`, e);
    }
};
//# sourceMappingURL=json5-decycle.js.map