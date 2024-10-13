/**
 * Utilities to inspect NPM packages and return exported classes/types/functions/interfaces
 */
import path from 'path';
import fs from 'fs-extra';
import { Project } from 'ts-morph';
export function packageReport(packageName) {
    const project = new Project({
        tsConfigFilePath: 'tsconfig.json',
    });
    const packagePath = path.resolve('node_modules', packageName);
    const packageJsonPath = path.join(packagePath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
        throw new Error(`Package ${packageName} not found in node_modules.`);
    }
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const entryPoint = packageJson.types || packageJson.typings || packageJson.main || 'index.d.ts';
    const entryPointPath = path.join(packagePath, entryPoint);
    if (!fs.existsSync(entryPointPath)) {
        throw new Error(`Entry point ${entryPointPath} not found for package ${packageName}.`);
    }
    const sourceFile = project.addSourceFileAtPath(entryPointPath);
    const exports = getExports(sourceFile);
    return {
        packageName,
        exports,
    };
}
export function getExports(sourceFile) {
    const exports = {};
    sourceFile.getExportedDeclarations().forEach((declarations, name) => {
        const declaration = declarations[0];
        const symbol = declaration.getSymbol();
        if (symbol) {
            exports[name] = getMemberInfo(symbol);
        }
    });
    return exports;
}
export function getMemberInfo(symbol) {
    const declaration = symbol.getDeclarations()[0];
    if (!declaration) {
        let decs = symbol.getDeclarations();
        //console.log(`decs:`,decs);
        let err = {
            name: "No Declarations for Symbol",
            kind: "Bad declaration",
        };
        return err;
    }
    const type = declaration.getType();
    const info = {
        name: symbol.getName(),
        kind: declaration.getKindName(),
    };
    if (type.isInterface() || type.isClass() || type.isObject()) {
        info.members = {};
        type.getProperties().forEach(prop => {
            info.members[prop.getName()] = getMemberInfo(prop);
        });
    }
    else {
        info.type = type.getText();
    }
    return info;
}
//# sourceMappingURL=module-introspection.js.map