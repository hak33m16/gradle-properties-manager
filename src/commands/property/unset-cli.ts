import chalk from 'chalk';
import { removeProperty } from './unset-utils';
import * as messages from './unset-text';
import * as common from '../../common';
import * as propertyCommon from './common-cli';

export const handleUnset = async (
    keyArg: string,
    options: { global: boolean; profile: string }
): Promise<void> => {
    common.assertGpmInitialized();

    const { global, profile } = options;

    if (global && profile != common.getCurrentProfileName()) {
        console.log(chalk.red(messages.INVALID_OPTIONS));
        process.exit(1);
    }

    let key = keyArg;
    while (!key) {
        key = await propertyCommon.promptKey();
    }

    try {
        removeProperty(key, profile, global);
        console.log(
            chalk.green(messages.SUCCESSFUL_PROP_REMOVAL),
            key,
            profile
        );
    } catch (ERROR) {
        console.log(chalk.red(ERROR));
        process.exit(1);
    }
};
