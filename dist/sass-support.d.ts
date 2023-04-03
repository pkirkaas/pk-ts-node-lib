/**
 * Almost never used - but IF debugging SASS/SCSS, can use sass-export to output sass variables as JSON -
 * but if the map keys are integers, JSON & JSON5 don't like it. So need to convert the sass-export json string
 * to something parsable.
 */
import { GenObj } from './index.js';
export declare function sassMapStringToJson(str: string): string;
export declare function sassMapStringToObj(str: string): GenObj;
//# sourceMappingURL=sass-support.d.ts.map