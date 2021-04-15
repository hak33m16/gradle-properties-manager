import fs from 'fs';

import * as constants from '../constants';
import {
    createGlobalProfile,
    createProfile,
    getAllProfiles,
    getCurrentProfileName,
    setProfile,
} from '../common';

import chalk from 'chalk';
import inquirer from 'inquirer';

const BACKUP_PROPERTIES =
    chalk.yellow('[WARN]') +
    ` File '${constants.GRADLE_PROPERTIES_FILE_NAME}' already exists, would you like to \
create a backup at '${constants.GRADLE_PROPERTIES_FILE_NAME}.bak'?`;

const ALREADY_INITIALIZED = chalk.red(
    "You've already initialized gradle-properties-manager..."
);

const BACKUP_FAILED = chalk.red(
    `Failed to backup existing '${constants.GRADLE_PROPERTIES_FILE_NAME}'...`
);

const BACKUP_ALREADY_EXISTS = chalk.red(
    `Backup file '${constants.GRADLE_PROPERTIES_BAK_FILE_NAME}' already exists...`
);

const BACKUP_CREATED = chalk.green(
    `Successfully backed up '${constants.GRADLE_PROPERTIES_FILE_NAME}' to '${constants.GRADLE_PROPERTIES_BAK_FILE_NAME}'...`
);

const CREATE_PROFILE = 'Enter name to use for initial profile';

//const backup = async (): Promise<void> => {};

const handleExistingProperties = async (): Promise<void> => {
    const { backup } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'backup',
            message: BACKUP_PROPERTIES,
        },
    ]);

    if (backup) {
        if (fs.existsSync(constants.GRADLE_PROPERTIES_BAK_FILE_LOCATION)) {
            console.log(BACKUP_ALREADY_EXISTS);
        }

        fs.copyFileSync(
            constants.GRADLE_PROPERTIES_FILE_LOCATION,
            constants.GRADLE_PROPERTIES_BAK_FILE_LOCATION
        );

        if (!fs.existsSync(constants.GRADLE_PROPERTIES_BAK_FILE_LOCATION)) {
            console.log(BACKUP_FAILED);
            process.exit(1);
        } else {
            console.log(BACKUP_CREATED);
        }

        fs.writeFileSync(
            constants.GRADLE_PROPERTIES_FILE_LOCATION,
            constants.GPM_ANNOTATION,
            { encoding: 'utf-8' }
        );
    }
};

const gpmInitialized = (): boolean => {
    const gradlePropertiesFileContent = fs.readFileSync(
        constants.GRADLE_PROPERTIES_FILE_LOCATION,
        'utf-8'
    );

    if (gradlePropertiesFileContent.includes(constants.GPM_ANNOTATION)) {
        return true;
    }

    // TODO: Account for the case where ~/.gpm exists, but nothing else

    return false;
};

const createInitialProfile = async (): Promise<void> => {
    const { name } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: CREATE_PROFILE,
            default: constants.GPM_DEFAULT_PROFILE_NAME,
        },
    ]);

    createProfile(name);
    setProfile(name);
};

export const handleInit = async (): Promise<void> => {
    // - check if there's an existing gradle.properties in ~/.gradle
    // - if there is, check if its gpm controlled, otherwise prompt to
    // confirm backup location of: ~/.gradle/gradle.properties.bak
    // - create new gradle.properties file with annotation that
    // indicates it is now gpm controlled (//@gpm)
    // - create ~/.gpm home directory
    // - ask if they'd like to move any existing properties to the global scope
    // - prompt for profile name?? [default]
    // - ask if they'd like to move any properties to this profile

    let promptForExistingProperties = false;
    if (fs.existsSync(constants.GRADLE_PROPERTIES_FILE_LOCATION)) {
        if (gpmInitialized()) {
            console.log(ALREADY_INITIALIZED);
            process.exit(1);
        }
        await handleExistingProperties();
        promptForExistingProperties = true;
    }

    fs.mkdirSync(constants.GPM_HOME_DIRECTORY_LOCATION);
    await createInitialProfile();
    createGlobalProfile();

    console.log('Current profile:', getCurrentProfileName());
    console.log('All profiles:', getAllProfiles());

    if (promptForExistingProperties) {
        // prompt to add existing properties to global scope
        // prompt to add existing properties to profile
    }
};
