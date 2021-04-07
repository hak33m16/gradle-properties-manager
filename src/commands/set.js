const fs = require('fs')
const path = require('path')
const os = require('os')

const chalk = require('chalk')
const { Command, Option } = require("commander");
const inquirer = require('inquirer')

const constants = require('../constants')
const common = require('../common')

let set = new Command('set')
    .arguments('[key] [value]')
    .description('Set a property for a specific profile')
    .action(async (key, value, options) => {
        console.log(chalk.green('Called set! with args:'))
        console.log('options: %s', options)
        console.log('key: %s', key)
        console.log('value: %s', value)

        //console.log(test)
        let prompts
        if (options.secret && !value && key) {
            prompts = await inquirer
                .prompt([{
                    type: 'password',
                    name: 'secret',
                    message: `Enter value for secret property '${key}'`,
                    mask: '*'
                }])
        } else if (key && value) {

        } else {

        }

        console.log(prompts.secret)
    });

let profile = new Option('-p, --profile <name>',
    'The name of the profile to set the property on')
    .makeOptionMandatory()

let secret = new Option('-s, --secret',
    'User will be prompted in silent mode for the property value')

set.addOption(profile)
set.addOption(secret)

export default set
