import chalk from 'chalk';
import { Command, Option } from 'commander';
import inquirer from 'inquirer';

const program = new Command();

program
    .command('set [key] [value]')
    .description('Add a new profile with the given name')
    .option(
        '-s, --secret',
        'User will be prompted in silent mode for the property value'
    )
    .action(async (key, value, options) => {
        console.log(chalk.green('beep boop adding profile:', key));

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
        console.log(prompts);
    });

program
    .command('unset [key]')
    .description('Remove the entry for a given property key')
    .action((name, options) => {});

program
    .command('get [key]')
    .description('Get the value associated with a given property key')
    .action((options) => {});

program
    .command('ls')
    .description('List all known profiles')
    .action((options) => {});

program.parse(process.argv);
