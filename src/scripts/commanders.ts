/**
 * Testing of the commander module
 */

import { Command } from 'commander';

const program = new Command()
  .name('tst-nodelib')
  .description('Test the pk-ts-node-lib module')
  .version('0.0.1')
  .option('-p, --port <number>','Port Number', '90')
  .option('-n, --name <string>','The name of it', 'DaliLamma')
  ;
  program
  .command('serve', {isDefault:true})
  .option('-m, --mmm <string>','The Opt for mmm', 'defmmm')
  .option('-g, --ggg <string>','the opt for ggg', 'defggg')
  .argument('<tiger>', 'The Tiger to use')
  .argument('[cub]', 'Are there any cubes?')
  .action((tiger, cub, options) => {
    let opts = program.opts();
    console.log(`Here`,{opts, tiger, cub, options});
  })
;

program
  .command('protect')
  .action(()=>console.log('protecting'))
  ;

//program.parse(process.argv);
program.parse();


;

// Run with: cmdr --name=Nazi  --port=99 serve --ggg=Never TIGER