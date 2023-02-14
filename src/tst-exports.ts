export const anexp = { tst: 'exported', obj: 'object'};
export function showExp() {
	console.log(`Using package.json exports! anexp:`, { anexp });
};