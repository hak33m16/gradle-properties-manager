import chalk from 'chalk';
import { listProperties } from './ls-utils';
import * as common from '../../common';

export const handleLs = async (options: {
    global: boolean;
    profile: string;
}): Promise<void> => {
    common.assertGpmInitialized();

    const { global, profile } = options;

    try {
        listProperties(profile, global);
    } catch (ERROR) {
        console.log(chalk.red(ERROR));
        process.exit(1);
    }
};
