import chalk from 'chalk';
import inquirer from 'inquirer';

const secretPrompt = () => {};

const promptKey = async () => {
    //non secret prompt
    const { propname } = await inquirer.prompt([
        {
            type: 'input',
            name: 'propname',
            message: 'Enter value propert key:',
        },
    ]);
    return propname;
};

const promptValue = async (key, secret) => {
    if (secret) {
        const { value } = await inquirer.prompt([
            {
                type: 'password',
                name: 'value',
                message: `Enter value for secret property '${key}'`,
                mask: '*',
            },
        ]);
        return value;
    }
    const { value } = await inquirer.prompt([
        {
            type: 'input',
            name: 'value',
            message: `Enter value for property '${key}'`,
        },
    ]);
    return value;
};

export const handleSet = async (keyInput, valueInput, options) => {
    const { secret } = options;
    let key = keyInput;
    let value = valueInput;
    if (!keyInput) {
        key = await promptKey();
    }
    if (!valueInput) {
        value = await promptValue(key, secret);
    }

    console.log(chalk.yellow('beep boop adding prop: '), key, value);
};
