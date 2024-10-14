/**
 * Utilities to inspect NPM packages and return exported classes/types/functions/interfaces
 */
import path from 'path';
import fs from 'fs-extra';
/**
 * Designed by Claude using `ts-morph` - supposed to return all module exports including TS Type & Inference, but
 * doesn't quite - needs ... something.
 * Needs to be run from project root - where tsconfig.json is.
 * @param packageName - name of an INSTALLED npm package, in node_modules directory
 */
// Does something - but not all I want... Enhance later...
import { Project, Node, SyntaxKind, } from 'ts-morph';
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
    const typesFile = packageJson.types || packageJson.typings || 'index.d.ts';
    const sourceFile = project.addSourceFileAtPath(path.join(packagePath, typesFile));
    const exports = {};
    // Process top-level declarations
    processDeclarations(sourceFile, exports);
    // Process namespaces
    sourceFile.getDescendantsOfKind(SyntaxKind.ModuleDeclaration).forEach(namespace => {
        const namespaceName = namespace.getName();
        const namespaceExports = {};
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
function processDeclarations(node, exports) {
    node.getExportedDeclarations().forEach((declarations, name) => {
        declarations.forEach(declaration => {
            if (Node.isTypeAliasDeclaration(declaration)) {
                exports[name] = processTypeAlias(declaration);
            }
            else if (Node.isInterfaceDeclaration(declaration)) {
                exports[name] = processInterface(declaration);
            }
            else if (Node.isClassDeclaration(declaration)) {
                exports[name] = processClass(declaration);
            }
            else if (Node.isEnumDeclaration(declaration)) {
                exports[name] = processEnum(declaration);
            }
            else if (Node.isFunctionDeclaration(declaration)) {
                exports[name] = processFunction(declaration);
            }
            else if (Node.isVariableDeclaration(declaration)) {
                exports[name] = processVariable(declaration);
            }
        });
    });
}
function processTypeAlias(declaration) {
    return {
        kind: 'typeAlias',
        name: declaration.getName(),
        typeParameters: declaration.getTypeParameters().map(tp => tp.getText()),
        typeAlias: declaration.getType().getText(),
    };
}
function processInterface(declaration) {
    const properties = {};
    const methods = {};
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
function processClass(declaration) {
    const properties = {};
    const methods = {};
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
function processProperty(prop) {
    return {
        type: prop.getType().getText(),
        optional: prop.hasQuestionToken(),
    };
}
function processMethod(method) {
    return {
        parameters: method.getParameters().map(processParameter),
        returnType: method.getReturnType().getText(),
    };
}
function processClassProperty(prop) {
    return {
        type: prop.getType().getText(),
        optional: prop.hasQuestionToken(),
    };
}
function processClassMethod(method) {
    return {
        parameters: method.getParameters().map(processParameter),
        returnType: method.getReturnType().getText(),
    };
}
function processParameter(param) {
    return {
        name: param.getName(),
        type: param.getType().getText(),
        optional: param.hasQuestionToken(),
    };
}
function processEnum(declaration) {
    return {
        kind: 'enum',
        name: declaration.getName(),
        enumMembers: declaration.getMembers().map(member => member.getName()),
    };
}
function processFunction(declaration) {
    return {
        kind: 'function',
        name: declaration.getName() || '',
        functionSignature: declaration.getSignature().getDeclaration().getText(),
    };
}
function processVariable(declaration) {
    return {
        kind: 'variable',
        name: declaration.getName(),
        variableType: declaration.getType().getText(),
    };
}
//# sourceMappingURL=module-introspection.js.map