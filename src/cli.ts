import { Command } from 'commander';
import { handleInit } from './commands/init';

const program = new Command();

program.command('profile', 'Manage profiles');
program.command('property', 'Manage properties');

program
    .command('init')
    .description('Initialize gpm for first-time use')
    .action(handleInit);

program.parse(process.argv);
