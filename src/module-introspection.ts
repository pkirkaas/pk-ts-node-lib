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

import { Project, SourceFile, ExportedDeclarations, Type, Symbol } from 'ts-morph';


export interface MemberInfo {
  name: string;
  kind: string;
  type?: string;
  members?: { [key: string]: MemberInfo; };
}

export interface PackageReport {
  packageName: string;
  exports: { [key: string]: MemberInfo; };
}

export function packageReport(packageName: string): PackageReport {
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

export function getExports(sourceFile: SourceFile): { [key: string]: MemberInfo; } {
  const exports: { [key: string]: MemberInfo; } = {};

  sourceFile.getExportedDeclarations().forEach((declarations, name) => {
    const declaration = declarations[0];
    const symbol = declaration.getSymbol();
    if (symbol) {
      exports[name] = getMemberInfo(symbol);
    }
  });

  return exports;
}

export function getMemberInfo(symbol: Symbol): MemberInfo {
  const declaration = symbol.getDeclarations()[0];
  if (!declaration) {
    let decs = symbol.getDeclarations();
    //console.log(`decs:`,decs);
    let err: MemberInfo = {
      name: "No Declarations for Symbol",
      kind: "Bad declaration",
    };
    return err;
  }
  const type = declaration.getType();

  const info: MemberInfo = {
    name: symbol.getName(),
    kind: declaration.getKindName(),
  };

  if (type.isInterface() || type.isClass() || type.isObject()) {
    info.members = {};
    type.getProperties().forEach(prop => {
      info.members![prop.getName()] = getMemberInfo(prop);
    });
  } else {
    info.type = type.getText();
  }

  return info;
}

