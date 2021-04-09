import { Command } from 'commander';
// TODO: Figure out how to fix our configuration so that we don't have to
// ts-ignore all imports:
// https://github.com/Microsoft/TypeScript/issues/11901
/* @ts-ignore */
import set from './commands/set.ts';
/* @ts-ignore */
//import profiles from './commands/profiles.ts';

const program = new Command();

program.addCommand(set);
//program.addCommand(profiles);

// @ts-expect-error: says the second arg is not allowed
const profiles = new Command('profiles', 'Commands related to profile CRUD');
program.addCommand(profiles);

program.parse(process.argv);
