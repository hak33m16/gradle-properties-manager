import chalk from 'chalk';
import { Command } from 'commander';
import * as common from '../common';

const program = new Command();

program
    .command('create [name]')
    .description('Add a new profile with the given name')
    .action(async (name: string) => {
        common.assertGpmInitialized();

        name = await common.resolveArg(name, 'name');
        common.createProfile(name, true);
        common.setProfile(name, true);
    });

program
    .command('set [name]')
    .description('Switch to an existing profile')
    .action(async (name: string) => {
        common.assertGpmInitialized();

        name = await common.resolveArg(name, 'name');
        common.setProfile(name, true);
    });

program
    .command('delete [name]')
    .description('Remove an existing profile with the given name')
    .action((name: string) => {
        common.assertGpmInitialized();

        // TODO: Add in a confirmation prompt to this (with a --force flag
        // option in order to not be prompted)
        common.deleteProfile(name, true);
    });

program
    .command('ls')
    .description('List all known profiles')
    .action(() => {
        common.assertGpmInitialized();

        common.listAllProfiles();
    });

program
    .action(() => {
        common.assertGpmInitialized();

        console.log(common.getCurrentProfileName());
    })
    .description('Get the name of the current profile');

program.parse(process.argv);
