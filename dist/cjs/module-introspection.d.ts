/**
 * Utilities to inspect NPM packages and return exported classes/types/functions/interfaces
 */
interface TypeInfo {
    kind: string;
    name: string;
    typeParameters?: string[];
    extends?: string[];
    properties?: Record<string, PropertyInfo>;
    methods?: Record<string, MethodInfo>;
    typeAlias?: string;
    enumMembers?: string[];
    functionSignature?: string;
    variableType?: string;
    members?: Record<string, TypeInfo>;
}
interface PropertyInfo {
    type: string;
    optional: boolean;
}
interface MethodInfo {
    parameters: ParameterInfo[];
    returnType: string;
}
interface ParameterInfo {
    name: string;
    type: string;
    optional: boolean;
}
interface PackageReport {
    name: string;
    version: string;
    exports: Record<string, TypeInfo>;
}
export declare function packageReport(packageName: string): PackageReport;
export {};
//# sourceMappingURL=module-introspection.d.ts.map