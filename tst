#!/bin/bash
echo "Building and executing ./dist/esm/scripts/test.js w. args:  [${*}]"
npm run build && node dist/esm/scripts/test ${*}
