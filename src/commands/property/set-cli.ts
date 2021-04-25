import chalk from 'chalk';
import { setProperty } from './set-utils';
import * as messages from './set-text';
import * as common from '../../common';
import * as propertyCommon from './common-cli';

export const handleSet = async (
    keyArg: string,
    valueArg: string,
    options: { encode: boolean; global: boolean; profile: string }
): Promise<void> => {
    common.assertGpmInitialized();

    const { encode, global, profile } = options;
    if (global && profile != common.getCurrentProfileName()) {
        console.log(chalk.red(messages.INVALID_OPTIONS));
        process.exit(1);
    }

    let key = keyArg;
    let value = valueArg;
    while (!key) {
        key = await propertyCommon.promptKey();
    }
    while (!value) {
        value = await propertyCommon.promptValue(key, encode);
    }

    try {
        await setProperty(key, value, encode, global, profile);
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
