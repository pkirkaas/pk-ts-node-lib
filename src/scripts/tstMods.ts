import _ from 'lodash';

import { envInit } from '../index.js';

envInit();

let tstenv = process.env.TSTENV;

console.log(`Loaded TSTENV: [${tstenv}]`);