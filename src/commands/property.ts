import chalk from 'chalk';
import { Command, Option } from 'commander';
import inquirer from 'inquirer';
import { PropertiesFile } from '../properties/properties-types';
import { handleSet } from './property/set-cli';
import { handleGet } from './property/get-cli';
import * as common from '../common';

const program = new Command();

program
    .command('set [key] [value]')
    .description('Add a new property with the given name')
    .option(
        '-s, --secret',
        'User will be silently prompted for the value, and it will be base64 encoded',
        false
    )
    .option(
        '-g, --global',
        'Saves the property to the global properties scope. \
This will be shared across all profiles',
        false
    )
    .option(
        '-p, --profile [name]',
        'Saves the property to a specific profile, ignoring the current one',
        common.getCurrentProfileName()
    )
    .action(handleSet);

program
    .command('unset [key]')
    .description('Remove the entry for a given property key')
    .option(
        '-g, --global',
        'Removes the property to the global properties scope',
        false
    )
    .option(
        '-p, --profile [name]',
        'Removes the property to a specific profile, ignoring the current one',
        common.getCurrentProfileName()
    )
    .action((key) => {});

program
    .command('get [key]')
    .option(
        '-g, --global',
        'Retrieves the property from the global scope',
        false
    )
    .option(
        '-p, --profile <name>',
        'Saves the property to a specific profile, ignoring the current one',
        common.getCurrentProfileName()
    )
    .option(
        '-d, --decode',
        'Decodes the property if it was a secret, NOOP otherwise',
        false
    )
    .description('Get the value associated with a given property key')
    .action(handleGet);

program
    .command('ls')
    .description('List all properties on a given profile')
    .option(
        '-g, --global',
        'Saves the property to the global properties scope. \
This will be shared across all profiles',
        false
    )
    .option(
        '-p, --profile [name]',
        'Saves the property to a specific profile, ignoring the current one',
        common.getCurrentProfileName()
    )
    .action((options) => {});

program.parse(process.argv);
