import { Command } from 'commander';
import set from './commands/set';
import profiles from './commands/profiles';

const program = new Command();

program.addCommand(set);
program.addCommand(profiles);
program.parse(process.argv);
