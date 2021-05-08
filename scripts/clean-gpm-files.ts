import fs from 'fs';
import inquirer from 'inquirer';
import * as constants from '../src/constants';

const promptFileRemoval = async (file: string) => {
    const { remove } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'remove',
            message: `Remove file '${file}'?`,
            default: false,
        },
    ]);

    if (remove) {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
    }
};

const promptDirectoryRemoval = async (directory: string) => {
    const { remove } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'remove',
            message: `Remove directory '${directory}' and all of it's content?`,
            default: false,
        },
    ]);

    if (remove) {
        if (fs.existsSync(directory)) {
            fs.rmdirSync(directory, { recursive: true });
        }
    }
};

const promptRemovalForAll = async (...paths: string[]) => {
    const { remove } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'remove',
            message: `Remove files/directories '${paths.join(', ')}'?`,
            default: false,
        },
    ]);

    if (remove) {
        paths.forEach((path) => {
            if (fs.existsSync(path)) {
                fs.lstatSync(path).isDirectory()
                    ? fs.rmdirSync(path, { recursive: true })
                    : fs.unlinkSync(path);
            }
        });
    }
};

const main = async (): Promise<void> => {
    if (process.argv[2] != undefined && process.argv[2] == 'all') {
        promptRemovalForAll(
            constants.GPM_HOME_PATH,
            constants.GRADLE_PROPERTIES_FILE_LOCATION,
            constants.GRADLE_PROPERTIES_BAK_FILE_LOCATION
        );
    } else {
        await promptDirectoryRemoval(constants.GPM_HOME_PATH);
        await promptFileRemoval(constants.GRADLE_PROPERTIES_FILE_LOCATION);
        await promptFileRemoval(constants.GRADLE_PROPERTIES_BAK_FILE_LOCATION);
    }
};

main();
