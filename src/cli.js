const { Command } = require("commander");
const program = new Command();

import init from './commands/init'
import set from './commands/set'
import profiles from './commands/profiles'

program.addCommand(set);
program.addCommand(profiles);
//program.command('profiles', 'Commands related to profile CRUD')

program.parse(process.argv)
