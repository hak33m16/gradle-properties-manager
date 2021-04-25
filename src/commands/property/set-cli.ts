import chalk from 'chalk';
import { setProperty } from './set-utils';
import * as messages from './set-text';
import * as common from '../../common';
import * as propertyCommon from './common-cli';

export const handleSet = async (
    keyArg: string,
    valueArg: string,
    options: { secret: boolean; global: boolean; profile: string }
): Promise<void> => {
    common.assertGpmInitialized();

    const { secret, global, profile } = options;
    let key = keyArg;
    let value = valueArg;
    while (!key) {
        key = await propertyCommon.promptKey();
    }
    while (!value) {
        value = await propertyCommon.promptValue(key, secret);
    }

    try {
        await setProperty(key, value, secret, global, profile);
        console.log(chalk.green(messages.SUCCESSFUL_PROP_ADDED), key, profile);
    } catch (ERROR) {
        console.log(chalk.red(ERROR));
        process.exit(1);
    }
};
