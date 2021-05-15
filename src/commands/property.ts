import { Command } from 'commander';

import { handleSet } from './property/set-cli';
import { handleGet } from './property/get-cli';
import { handleUnset } from './property/unset-cli';
import { handleLs } from './property/ls-cli';
import * as common from '../common';

const program = new Command();

program
    .command('set [key] [value]')
    .description('Add a new property with the given name')
    .option(
        '-e, --encoded',
        'Property will be base64 encoded and masked on display. If the value is omitted, user will be silently prompted',
        false
    )
    .option(
        '-m, --masked',
        'Property will be masked when displayed. If the value is omitted, user will be silently prompted',
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
    .action(handleUnset);

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
        'Decodes the property if it was a secret, NOP otherwise',
        false
    )
    .option(
        '-u, --unmask',
        'Unmasks the property if it was masked, NOP otherwise',
        false
    )
    .description('Get the value associated with a given property key')
    .action(handleGet);

program
    .command('ls')
    .description('List all properties on a given profile')
    .option(
        '-g, --global',
        'The list will include properties in the global scope',
        false
    )
    .option(
        '-p, --profile [name]',
        'Saves the property to a specific profile, ignoring the current one',
        common.getCurrentProfileName()
    )
    .action(handleLs);

program.parse(process.argv);
