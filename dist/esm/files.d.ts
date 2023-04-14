import fs from "fs-extra";
export { fs };
import { OptArrStr } from 'pk-ts-common-lib';
export declare function getFilename(url: string, ...parts: any[]): string;
export declare function getDirname(url: string, ...parts: any[]): string;
/**
 * Returns array of file paths found in the
 * paths arg, recursive
 */
export declare function getFilePaths(paths: OptArrStr): any[];
