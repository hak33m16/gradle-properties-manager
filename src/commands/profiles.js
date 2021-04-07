const fs = require('fs')
const path = require('path')
const os = require('os')

const chalk = require('chalk')
const { Command, Option} = require("commander");
const inquirer = require('inquirer')

const constants = require('../constants')
const common = require('../common')

// const program = new Command();

let profiles = new Command('profiles', 'Commands related to profile CRUD')
    .action((idk, options) => {
        console.log(options.args)
    })

let profiles_add = new Command('add [name]')
    .description('Add a new profile with the given name')
    .action((name, options) => {
        console.log(chalk.green('beep boop adding profile:', name))
/*
- Check if profile exists
- If not, create it and let the user know the current profile
  will be switched to this one
- Prompt the user for any properties they'd like to add
  (should be a continuous interactive prompt that they
   must exit from)
*/
    });

let profiles_remove = new Command('remove [name]')
    .description('Remove an existing profile with the given name')
    .action((name, options) => {

    })

let profiles_list = new Command('list')
    .description('List all known profiles')
    .action((options) => {

    })

// program.addCommand(profiles_add)
// program.addCommand(profiles_remove)
// program.addCommand(profiles_list)

profiles.addCommand(profiles_add)
profiles.addCommand(profiles_remove)
profiles.addCommand(profiles_list)

//let secret = new Option('-s, --secret',
//    'User will be prompted in silent mode for the property value')

//set.addOption(secret)

export default profiles
