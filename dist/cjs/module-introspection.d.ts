/**
 * Utilities to inspect NPM packages and return exported classes/types/functions/interfaces
 */
import { SourceFile, Symbol } from 'ts-morph';
export interface MemberInfo {
    name: string;
    kind: string;
    type?: string;
    members?: {
        [key: string]: MemberInfo;
    };
}
export interface PackageReport {
    packageName: string;
    exports: {
        [key: string]: MemberInfo;
    };
}
export declare function packageReport(packageName: string): PackageReport;
export declare function getExports(sourceFile: SourceFile): {
    [key: string]: MemberInfo;
};
export declare function getMemberInfo(symbol: Symbol): MemberInfo;
//# sourceMappingURL=module-introspection.d.ts.map