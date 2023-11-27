/** Init shared by MongoQP-api & MongoQP-client */
export * from "./lib/json-decyle-3.js";
export type OptArrStr = string | string[];
export type Falsy = false | 0 | "" | null | undefined;
export type GenericObject = {
    [key: string]: any;
};
export type GenObj = {
    [key: string]: any;
};
declare global {
    interface Array<T> {
        readonly random: any;
    }
    interface JSON {
        decycle(object: any): any;
        retrocycle(object: any): any;
    }
    interface JSON5 {
        decycle(object: any): any;
        retrocycle(object: any): any;
    }
}
export * from './common-operations.js';
export * from './tag-classes.js';
export * from './object-utils.js';
export * from './util-classes.js';
export * from './axios-init.js';
//# sourceMappingURL=index.d.ts.map