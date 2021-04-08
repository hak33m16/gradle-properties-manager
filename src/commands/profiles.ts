import fs from 'fs';
import path from 'path';
import os from 'os';

import chalk from 'chalk';
import { Command, Option } from 'commander';
import inquirer from 'inquirer';

// import constants from '../constants';
// import common from '../common';

// const program = new Command();

// @ts-expect-error: says the second arg is not allowed
const profiles = new Command('profiles', 'Commands related to profile CRUD');

const profiles_add = new Command('add [name]')
    .description('Add a new profile with the given name')
    .action((name, options) => {
        console.log(chalk.green('beep boop adding profile:', name));

        /*
        - Check if profile exists
        - If not, create it and let the user know the current profile
        will be switched to this one
        - Prompt the user for any properties they'd like to add
        (should be a continuous interactive prompt that they
        must exit from)
    */
    });

const profiles_remove = new Command('remove [name]')
    .description('Remove an existing profile with the given name')
    .action((name, options) => {});

const profiles_list = new Command('list')
    .description('List all known profiles')
    .action((options) => {});

// program.addCommand(profiles_add)
// program.addCommand(profiles_remove)
// program.addCommand(profiles_list)

profiles.addCommand(profiles_add);
profiles.addCommand(profiles_remove);
profiles.addCommand(profiles_list);

//let secret = new Option('-s, --secret',
//    'User will be prompted in silent mode for the property value')

//set.addOption(secret)

export default profiles;
