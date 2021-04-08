// import fs from 'fs';
// import path from 'path';
// import os from 'os';
import chalk from 'chalk';
import { Command, Option } from 'commander';
import inquirer from 'inquirer';
// import constants from '../constants';
// import common from '../common';

const set = new Command('set')
    .arguments('[key] [value]')
    .description('Set a property for a specific profile')
    .action(async (key, value, options) => {
        console.log(chalk.green('Called set! with args:'));
        console.log('options: %s', options);
        console.log('key: %s', key);
        console.log('value: %s', value);

        //console.log(test)
        let prompts;
        if (options.secret && !value && key) {
            prompts = await inquirer.prompt([
                {
                    type: 'password',
                    name: 'secret',
                    message: `Enter value for secret property '${key}'`,
                    mask: '*',
                },
            ]);
        } else if (key && value) {
            // some logic
        } else {
            // other logic
        }

        console.log(prompts.secret);
    });

const profile = new Option(
    '-p, --profile <name>',
    'The name of the profile to set the property on'
).makeOptionMandatory();

const secret = new Option(
    '-s, --secret',
    'User will be prompted in silent mode for the property value'
);

set.addOption(profile);
set.addOption(secret);

export default set;
