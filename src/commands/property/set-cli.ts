import chalk from 'chalk';
import inquirer from 'inquirer';
import { addProperty } from './set-utils';
import {
    ENTER_KEY,
    INVALID_KEY,
    ENTER_VALUE,
    ENTER_SECRET_VALUE,
    INVALID_VALUE,
    ADDING_PROP,
    SUCCESSFUL_PROP_ADDED,
} from './set-text';

const promptKey = async () => {
    const { propname } = await inquirer.prompt([
        {
            type: 'input',
            name: 'propname',
            message: ENTER_KEY,
        },
    ]);
    if (!propname) {
        console.log(chalk.red(INVALID_KEY));
    }
    return propname;
};

const promptValue = async (key: string, secret: boolean) => {
    const secretPrompt = {
        type: 'password',
        name: 'value',
        message: ENTER_SECRET_VALUE,
        mask: '*',
    };

    const publicPrompt = {
        type: 'input',
        name: 'value',
        message: ENTER_VALUE,
    };

    const prompt = secret ? secretPrompt : publicPrompt;

    const { value } = await inquirer.prompt([prompt]);

    if (!value) {
        console.log(chalk.red(INVALID_VALUE));
    }

    return value;
};

export const handleSet = async (
    keyArg: string,
    valueArg: string,
    options: { secret: boolean; global: boolean }
): Promise<void> => {
    const { secret, global } = options;
    let key = keyArg;
    let value = valueArg;
    while (!key) {
        key = await promptKey();
    }
    while (!value) {
        value = await promptValue(key, secret);
    }

    console.log(chalk.yellow(ADDING_PROP), `${key}=${value}`);
    try {
        await addProperty(key, value, secret, global);
        console.log(chalk.green(SUCCESSFUL_PROP_ADDED));
    } catch (ERROR) {
        console.log(chalk.red(ERROR));
    }
};
