import chalk from 'chalk';
import { setProperty } from './set-utils';
import * as messages from './set-text';
import * as common from '../../common';
import * as propertyCommon from './common-cli';

export const handleSet = async (
    keyArg: string,
    valueArg: string,
    options: {
        encoded: boolean;
        masked: boolean;
        global: boolean;
        profile: string;
    }
): Promise<void> => {
    common.assertGpmInitialized();

    const { encoded, masked, global, profile } = options;

    // Default value of profile is the current one. Because of that, we can't
    // explicitly detect whether the user set the profile or not. This is a guess
    if (global && profile != common.getCurrentProfileName()) {
        console.log(chalk.red(messages.INVALID_OPTIONS));
        process.exit(1);
    }

    if (encoded && masked) {
        console.log(chalk.red(messages.INVALID_TYPE));
        process.exit(1);
    }

    let key = keyArg;
    let value = valueArg;
    while (!key) {
        key = await propertyCommon.promptKey();
    }
    while (!value) {
        value = await propertyCommon.promptValue(key, encoded, masked);
    }

    try {
        await setProperty(key, value, encoded, masked, global, profile);
        console.log(
            chalk.green(messages.SUCCESSFUL_PROP_ADDED),
            key,
            global ? 'global' : profile
        );
    } catch (ERROR) {
        console.log(chalk.red(ERROR));
        process.exit(1);
    }
};
