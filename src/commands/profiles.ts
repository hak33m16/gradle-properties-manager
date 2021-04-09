import chalk from 'chalk';
import { Command, Option } from 'commander';
import inquirer from 'inquirer';

// import constants from '../constants';
// import common from '../common';

// const program = new Command();

const profiles = new Command();

// TODO: Figure out why we have to set the description here when the docs state
// that using the second parameter in the constructor should be sufficient
// https://github.com/tj/commander.js/blob/master/examples/pm#L12

console.log('we out here');

const profiles_set = new Command('set [name]')
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

const profiles_remove = new Command('unset [name]')
    .description('Remove an existing profile with the given name')
    .action((name, options) => {});

const profiles_list = new Command('ls')
    .description('List all profiles')
    .action((options) => {});

profiles.addCommand(profiles_set);
profiles.addCommand(profiles_remove);
profiles.addCommand(profiles_list);

//let secret = new Option('-s, --secret',
//    'User will be prompted in silent mode for the property value')

//set.addOption(secret)

//export default profiles;

profiles.parse(process.argv);
