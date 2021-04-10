import { Command } from 'commander';

const program = new Command();

program.command('profile', 'Manange profiles');
program.command('property', 'Manage properties');

program.parse(process.argv);
