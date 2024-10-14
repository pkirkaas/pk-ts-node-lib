/**
 * Utilities to inspect NPM packages and return exported classes/types/functions/interfaces
 */

import * as ts from 'typescript';
import path from 'path';
import fs from 'fs-extra';

// PkLib Imports

import {
  GenObj, typeOf,
} from 'pk-ts-common-lib';




/**
 * Designed by Claude using `ts-morph` - supposed to return all module exports including TS Type & Inference, but
 * doesn't quite - needs ... something.
 * Needs to be run from project root - where tsconfig.json is.
 * @param packageName - name of an INSTALLED npm package, in node_modules directory
 */

//import { Project, SourceFile, Node, Symbol, Type, TypeAliasDeclaration, InterfaceDeclaration, ClassDeclaration, EnumDeclaration, FunctionDeclaration, VariableDeclaration, ModuleDeclaration } from 'ts-morph';


import { Project, SourceFile, Node, TypeAliasDeclaration, InterfaceDeclaration, ClassDeclaration, EnumDeclaration, FunctionDeclaration, VariableDeclaration, ModuleDeclaration, SyntaxKind, MethodSignature, PropertySignature, ParameterDeclaration, PropertyDeclaration, MethodDeclaration, } from 'ts-morph';

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

function packageReport(packageName: string): PackageReport {
    const project = new Project({
        tsConfigFilePath: 'tsconfig.json',
    });

    const packagePath = path.resolve('node_modules', packageName);
    const packageJsonPath = path.join(packagePath, 'package.json');

    if (!fs.existsSync(packageJsonPath)) {
        throw new Error(`Package ${packageName} not found in node_modules.`);
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const typesFile = packageJson.types || packageJson.typings || 'index.d.ts';

    const sourceFile = project.addSourceFileAtPath(path.join(packagePath, typesFile));

    const exports: Record<string, TypeInfo> = {};

    // Process top-level declarations
    processDeclarations(sourceFile, exports);

    // Process namespaces
    sourceFile.getDescendantsOfKind(SyntaxKind.ModuleDeclaration).forEach(namespace => {
        const namespaceName = namespace.getName();
        const namespaceExports: Record<string, TypeInfo> = {};
        processDeclarations(namespace, namespaceExports);
        exports[namespaceName] = {
            kind: 'namespace',
            name: namespaceName,
            members: namespaceExports,
        };
    });

    return {
        name: packageName,
        version: packageJson.version,
        exports,
    };
}

function processDeclarations(node: SourceFile | ModuleDeclaration, exports: Record<string, TypeInfo>) {
    node.getExportedDeclarations().forEach((declarations, name) => {
        declarations.forEach(declaration => {
            if (Node.isTypeAliasDeclaration(declaration)) {
                exports[name] = processTypeAlias(declaration);
            } else if (Node.isInterfaceDeclaration(declaration)) {
                exports[name] = processInterface(declaration);
            } else if (Node.isClassDeclaration(declaration)) {
                exports[name] = processClass(declaration);
            } else if (Node.isEnumDeclaration(declaration)) {
                exports[name] = processEnum(declaration);
            } else if (Node.isFunctionDeclaration(declaration)) {
                exports[name] = processFunction(declaration);
            } else if (Node.isVariableDeclaration(declaration)) {
                exports[name] = processVariable(declaration);
            }
        });
    });
}

function processTypeAlias(declaration: TypeAliasDeclaration): TypeInfo {
    return {
        kind: 'typeAlias',
        name: declaration.getName(),
        typeParameters: declaration.getTypeParameters().map(tp => tp.getText()),
        typeAlias: declaration.getType().getText(),
    };
}

function processInterface(declaration: InterfaceDeclaration): TypeInfo {
    const properties: Record<string, PropertyInfo> = {};
    const methods: Record<string, MethodInfo> = {};

    declaration.getProperties().forEach(prop => {
        properties[prop.getName()] = processProperty(prop);
    });

    declaration.getMethods().forEach(method => {
        methods[method.getName()] = processMethod(method);
    });

    return {
        kind: 'interface',
        name: declaration.getName(),
        typeParameters: declaration.getTypeParameters().map(tp => tp.getText()),
        extends: declaration.getExtends().map(ext => ext.getText()),
        properties,
        methods,
    };
}

function processClass(declaration: ClassDeclaration): TypeInfo {
    const properties: Record<string, PropertyInfo> = {};
    const methods: Record<string, MethodInfo> = {};

    declaration.getProperties().forEach(prop => {
      properties[prop.getName()] = processClassProperty(prop);
    });

    declaration.getMethods().forEach(method => {
        methods[method.getName()] = processClassMethod(method);
    });


    return {
        kind: 'class',
        name: declaration.getName(),
        typeParameters: declaration.getTypeParameters().map(tp => tp.getText()),
        extends: declaration.getExtends() ? [declaration.getExtends().getText()] : [],
        properties,
        methods,
    };
}

function processProperty(prop: PropertySignature): PropertyInfo {
    return {
        type: prop.getType().getText(),
        optional: prop.hasQuestionToken(),
    };
}

function processMethod(method: MethodSignature): MethodInfo {
    return {
        parameters: method.getParameters().map(processParameter),
        returnType: method.getReturnType().getText(),
    };
}

function processClassProperty(prop: PropertyDeclaration): PropertyInfo {
    return {
        type: prop.getType().getText(),
        optional: prop.hasQuestionToken(),
    };
}

function processClassMethod(method: MethodDeclaration): MethodInfo {
    return {
        parameters: method.getParameters().map(processParameter),
        returnType: method.getReturnType().getText(),
    };
}
function processParameter(param: ParameterDeclaration): ParameterInfo {
    return {
        name: param.getName(),
        type: param.getType().getText(),
        optional: param.hasQuestionToken(),
    };
}

function processEnum(declaration: EnumDeclaration): TypeInfo {
    return {
        kind: 'enum',
        name: declaration.getName(),
        enumMembers: declaration.getMembers().map(member => member.getName()),
    };
}

function processFunction(declaration: FunctionDeclaration): TypeInfo {
    return {
        kind: 'function',
        name: declaration.getName() || '',
        functionSignature: declaration.getSignature().getDeclaration().getText(),
    };
}

function processVariable(declaration: VariableDeclaration): TypeInfo {
    return {
        kind: 'variable',
        name: declaration.getName(),
        variableType: declaration.getType().getText(),
    };
}