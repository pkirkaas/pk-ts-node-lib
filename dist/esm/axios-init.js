/**
 * Create new Axios instance, configured
 */
import axios from 'axios';
import { keysFromJson, } from './index.js';
export const axiosDefaults = {
    headers: {},
};
/**
Look into JST Auth Tokens:

"Authorization": `Bearer ${token}`,
*/
/**
 * Some settings to simplify creating axios settings
 */
export const axiosSettings = {
    /**
     * Just for Prisma/SQLite that don't support JSON data - automatically convert/parse
     * any data keys ending in '*JSON' from json string to JS object
     */
    keysFromJson: {
        transformResponse: (data) => {
            return keysFromJson(data);
        }
    },
    //CORS & JSON
    CORSJSON: {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    },
    /*
    unsafe: { // Don't be picky about https during development
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        })
    },
    */
};
export function createAxios(opts = {}) {
    let config = {};
    return axios.create(config);
}
//# sourceMappingURL=axios-init.js.map