import chalk from 'chalk';
import { Command } from 'commander';

const program = new Command();

program
    .command('create [name]')
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

program
    .command('delete [name]')
    .description('Remove an existing profile with the given name')
    .action((name, options) => {});

program
    .command('describe [name]')
    .description('Describe a profile')
    .action((options) => {});

program
    .command('ls')
    .description('List all known profiles')
    .action((options) => {});

program.parse(process.argv);
