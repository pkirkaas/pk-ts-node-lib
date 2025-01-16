/**
 * Node File  System functions/utilities
 */
import fs from "fs-extra";
export { fs };
import { Strings, OptArrStr } from 'pk-ts-common-lib';
/** THIS ASSUMES WE ARE IN A MODULE SYSTEM
 * Replaces __dirname & __filename
 * TODO: Investigate further - like - what is 'import.meta.url'?
 */
/**
 * Returns the full filename/path of the calling module/file -
 * Awkwardly replaces __filename - BUT calling module has to call with:
 * let __filename = getFilename(import.meta.url)
 *
 *
 * CONSIDER - creating a function that creates a function from a string with th Function constructor, or
 */
export declare function getFilename(url: string, ...parts: any[]): string;
/** As above, ONLY for ESM replacing __dirname
 * const __dirname = getDirname(import.meta.url);
 */
export declare function getDirname(url: string, ...parts: any[]): string;
/**
 * Returns array of file paths found in the
 * paths arg, recursive
 */
export declare function getFilePaths(paths: OptArrStr): any[];
export declare const extTypes: {
    vid: string[];
    img: string[];
    aud: string[];
};
/**
 * Returns flat array of file paths found in the folder, recursive
 * @param folder:string - path to folder
 * @param types?:string|string[] - optional white list file type to filter on -
 *   a key to extTypes, or ext string
 *   if empty, all files
 * @return array of file paths
 */
export declare function getFiles(folder: string, types?: Strings): string[];
/**
 * Returns SET of all extensions in a folder, testing getFiles w. types
 * @param folder:string - path to folder
 * @param types?:string|string[] - optional white list file type to filter on -
 *   a key to extTypes, or ext string
 *   if empty, all files
 * @return array of file extensions found
 */
export declare function getAllExts(folder: string, types?: Strings): string[];
//# sourceMappingURL=files.d.ts.map