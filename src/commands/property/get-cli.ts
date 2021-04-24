import chalk from 'chalk';
import * as common from '../../common';
import * as propertyCommon from './common-cli';
import * as messages from './get-text';
import { getPropertyValue } from './get-utils';

export const handleGet = async (
    keyArg: string,
    options: { global: boolean; profile: string; decode: boolean }
): Promise<void> => {
    common.assertGpmInitialized();

    const { global, profile, decode } = options;

    let key = keyArg;
    while (!key) {
        key = await propertyCommon.promptKey();
    }

    const value = getPropertyValue(key, global, profile, decode);
    if (value) {
        console.log(value);
    } else {
        console.log(chalk.red(messages.NOT_FOUND), key);
    }
};
