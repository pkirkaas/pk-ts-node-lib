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
export declare const decycle: () => (this: any, key: string | symbol, value: any) => any;
export declare function retrocycle(): (this: object, key: string | symbol, value: any) => any;
export declare const extend: (JSON5: any) => any;
//# sourceMappingURL=json5-decycle.d.ts.map