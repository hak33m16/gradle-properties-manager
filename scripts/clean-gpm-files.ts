import fs from 'fs';
import inquirer from 'inquirer';
import * as constants from '../src/constants';

const promptFileRemoval = async (file: string) => {
    const { remove } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'backup',
            message: `Remove file '${file}'?`,
            default: false,
        },
    ]);

    if (remove) {
        fs.unlinkSync(file);
    }
};

const promptDirectoryRemoval = async (directory: string) => {
    const { remove } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'backup',
            message: `Remove directory '${directory}' and all of it's content?`,
            default: false,
        },
    ]);

    if (remove) {
        fs.rmdirSync(directory, { recursive: true });
    }
};

const main = async (): Promise<void> => {
    await promptDirectoryRemoval(constants.GPM_HOME_DIRECTORY_LOCATION);
    await promptFileRemoval(constants.GRADLE_PROPERTIES_FILE_LOCATION);
    await promptFileRemoval(constants.GRADLE_PROPERTIES_BAK_FILE_LOCATION);
};

main();
