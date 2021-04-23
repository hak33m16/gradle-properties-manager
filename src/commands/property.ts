import chalk from 'chalk';
import { Command, Option } from 'commander';
import inquirer from 'inquirer';
import { PropertiesFile } from '../properties/properties';
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
        'Saves the property to the global properties scope. \
This will be shared across all profiles'
    )
    .option(
        '-p, --profile',
        'Saves the property to a specific profile, ignoring the current one'
    )
    .action(handleSet);

program
    .command('unset [key]')
    .description('Remove the entry for a given property key')
    .action((name, options) => {
        const props = '/home/abadran/test-gradle-project/gradle.properties';
        const file: PropertiesFile = new PropertiesFile(props);
        file.load();
    });

program
    .command('get [key]')
    .description('Get the value associated with a given property key')
    .action((options) => {});

program
    .command('ls')
    .description('List all known profiles')
    .action((options) => {});

program.parse(process.argv);
