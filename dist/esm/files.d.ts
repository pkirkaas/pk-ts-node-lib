import fs from "fs-extra";
export { fs };
import { OptArrStr } from 'pk-ts-common-lib';
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
//# sourceMappingURL=files.d.ts.map