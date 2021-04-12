import chalk from 'chalk';
import { Command, Option } from 'commander';
import inquirer from 'inquirer';
import { handleSet } from './property/set-cli';

const program = new Command();

program
    .command('set [key] [value]')
    .description('Add a new profile with the given name')
    .option(
        '-s, --secret',
        'User will be prompted in silent mode for the property value'
    )
    .option(
        '-g, --global',
        'Sets the property to the shared, global properties scope. This will be shared across all profiles'
    )
    .action(handleSet);

program
    .command('unset [key]')
    .description('Remove the entry for a given property key')
    .action((name, options) => {});

program
    .command('get [key]')
    .description('Get the value associated with a given property key')
    .action((options) => {});

program
    .command('ls')
    .description('List all known profiles')
    .action((options) => {});

program.parse(process.argv);
