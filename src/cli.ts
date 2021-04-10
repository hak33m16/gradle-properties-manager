import { Command } from 'commander';
// TODO: Figure out how to fix our configuration so that we don't have to
// ts-ignore all imports:
// https://github.com/Microsoft/TypeScript/issues/11901

const program = new Command();

program.command('profile', 'Commands related to profile CRUD');
program.command('property', 'Commands related to property CRUD');

program.parse(process.argv);
