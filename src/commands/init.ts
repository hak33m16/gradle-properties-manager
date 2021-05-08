import fs from 'fs';

import * as constants from '../constants';
import * as common from '../common';
import * as messages from './init/init-text';

import inquirer from 'inquirer';

const copyExistingProperties = async (): Promise<void> => {
    const { backupToProfile } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'backupToProfile',
            message: `Select properties from '${constants.GRADLE_PROPERTIES_FILE_LOCATION}'\
to backup to profile `,
        },
    ]);
};

const backupExistingPropertiesFile = async (): Promise<void> => {
    const { backup } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'backup',
            message: messages.BACKUP_PROPERTIES_FILE,
        },
    ]);

    if (backup) {
        if (fs.existsSync(constants.GRADLE_PROPERTIES_BAK_FILE_LOCATION)) {
            console.log(messages.BACKUP_ALREADY_EXISTS);
        }

        fs.copyFileSync(
            constants.GRADLE_PROPERTIES_FILE_LOCATION,
            constants.GRADLE_PROPERTIES_BAK_FILE_LOCATION
        );

        if (!fs.existsSync(constants.GRADLE_PROPERTIES_BAK_FILE_LOCATION)) {
            console.log(messages.BACKUP_FAILED);
            process.exit(1);
        } else {
            console.log(messages.BACKUP_CREATED);
        }
    }
};

const createInitialProfile = async (): Promise<void> => {
    const { name } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: messages.CREATE_PROFILE,
            default: constants.GPM_DEFAULT_PROFILE_NAME,
        },
    ]);

    common.createProfile(name);
    common.setProfile(name);
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

    if (common.gpmInitialized()) {
        console.log(messages.ALREADY_INITIALIZED);
        process.exit(1);
    }

    if (fs.existsSync(constants.GRADLE_PROPERTIES_FILE_LOCATION)) {
        await backupExistingPropertiesFile();
    }

    if (!fs.existsSync(constants.GRADLE_HOME_DIRECTORY_LOCATION)) {
        console.log(messages.GRADLE_NOT_FOUND);
        process.exit(1);
    }

    // Create gpm-controlled gradle.properties file
    fs.writeFileSync(
        constants.GRADLE_PROPERTIES_FILE_LOCATION,
        `${constants.GPM_ANNOTATION}\n${constants.GPM_API_VERSION_ANNOTATION}`,
        { encoding: 'utf-8' }
    );

    fs.mkdirSync(constants.GPM_HOME_PATH);
    common.createGlobalProfile();
    await createInitialProfile();
};
