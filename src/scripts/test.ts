import { isEmpty, typeOf,ask, runCli, } from '../index.js';

/*
console.log("Testing lib");

const anobj = { a: "b", c: "d" };
const anarr = [1, 2, 3];
const astr = "abc";

let tob = typeOf(anobj);
let toa = typeOf(anarr);
let tos = typeOf(astr);

console.log({ tob, toa, tos });
*/

async function tstAsk() {
	let answer = await ask('What color are your eyes?', {  choices: ['red', 'blue', 'green'] });
	console.log({ answer });
}

runCli(tstAsk);