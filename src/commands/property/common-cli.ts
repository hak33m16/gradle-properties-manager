import chalk from 'chalk';
import inquirer from 'inquirer';

import * as messages from './common-text';

export const promptKey = async (): Promise<string> => {
    const { propname } = await inquirer.prompt([
        {
            type: 'input',
            name: 'propname',
            message: messages.ENTER_KEY,
        },
    ]);
    if (!propname) {
        console.log(chalk.red(messages.INVALID_KEY));
    }
    return propname;
};

export const promptValue = async (
    key: string,
    secret: boolean
): Promise<string> => {
    const secretPrompt = {
        type: 'password',
        name: 'value',
        message: messages.ENTER_SECRET_VALUE,
        mask: '*',
    };

    const publicPrompt = {
        type: 'input',
        name: 'value',
        message: messages.ENTER_VALUE,
    };

    const prompt = secret ? secretPrompt : publicPrompt;

    const { value } = await inquirer.prompt([prompt]);

    if (!value) {
        console.log(chalk.red(messages.INVALID_VALUE));
    }

    return value;
};
