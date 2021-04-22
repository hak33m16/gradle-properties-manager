import chalk from 'chalk';
import { Command } from 'commander';
import * as common from '../common';

const program = new Command();

program
    .command('create [name]')
    .description('Add a new profile with the given name')
    .action((name: string) => {
        common.assertGpmInitialized();
        common.assertNotNullOrEmpty(name, 'name');

        common.createProfile(name);
        common.setProfile(name, true);
    });

program
    .command('delete [name]')
    .description('Remove an existing profile with the given name')
    .action((name: string) => {
        common.assertGpmInitialized();
        common.assertNotNullOrEmpty(name, 'name');

        common.deleteProfile(name, true);
    });

program
    .command('ls')
    .description('List all known profiles')
    .action(() => {
        common.assertGpmInitialized();

        common.listAllProfiles();
    });

program.action(() => {
    common.assertGpmInitialized();

    console.log(common.getCurrentProfileName());
});

program.parse(process.argv);
