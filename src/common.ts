import fs from 'fs';
import { Dirent } from 'node:fs';
import path from 'path';

import chalk from 'chalk';

import * as constants from './constants';

const PROFILE_SWITCHED = 'Profile switched to: %s';
const PROFILE_SWITCH_FAILED =
    "Can't switch to profile '%s' as it doesn't exist";
const PROFILE_ALREADY_EXISTS = "Profile '%s' already exists";
const PROFILE_DOESNT_EXIST = "Profile '%s' does not exist";
const CANT_DELETE_CURRENT_PROFILE =
    "Can't delete profile '%s' as that's the current profile";
const PROFILE_DELETED = 'Sucessfully deleted profile: %s';

export const log = (message: string, level: number): void => {
    console.log(message, level);
};

export const getCurrentProfileName = (): string => {
    return fs.readFileSync(constants.GPM_CURRENT_PROFILE_FILE_LOCATION, {
        encoding: 'utf-8',
    });
};

export const getProfileFileLocation = (profile: string): string => {
    return path.join(
        constants.GPM_HOME_DIRECTORY_LOCATION,
        `${profile}.${constants.PROPERTIES_FILE_EXTENSION}`
    );
};

export const profileExists = (profile: string): boolean => {
    if (profile == constants.GPM_GLOBAL_PROPERTIES_PROFILE) {
        throw new Error(
            `'${profile}' is not a valid profile, it's the global properties store`
        );
    }

    const profileLocation: string = path.join(
        constants.GPM_HOME_DIRECTORY_LOCATION,
        `${profile}.${constants.PROPERTIES_FILE_EXTENSION}`
    );

    return fs.existsSync(profileLocation);
};

export const createGlobalProfile = (): void => {
    if (!fs.existsSync(constants.GPM_GLOBAL_PROPERTIES_FILE_LOCATION)) {
        fs.writeFileSync(
            constants.GPM_GLOBAL_PROPERTIES_FILE_LOCATION,
            constants.GPM_ANNOTATION,
            { encoding: 'utf-8' }
        );
    }
};

export const createProfile = (profile: string): void => {
    if (profileExists(profile)) {
        console.log(chalk.red(PROFILE_ALREADY_EXISTS), profile);
        process.exit(1);
    } else {
        fs.writeFileSync(
            path.join(
                constants.GPM_HOME_DIRECTORY_LOCATION,
                `${profile}.${constants.PROPERTIES_FILE_EXTENSION}`
            ),
            constants.GPM_ANNOTATION,
            { encoding: 'utf-8' }
        );
    }
};

export const deleteProfile = (profile: string, alert = false): boolean => {
    if (!profileExists(profile)) {
        console.log(chalk.red(PROFILE_DOESNT_EXIST), profile);
        process.exit(1);
    }

    if (getCurrentProfileName() == profile) {
        console.log(chalk.red(CANT_DELETE_CURRENT_PROFILE), profile);
        process.exit(1);
    }

    fs.unlinkSync(getProfileFileLocation(profile));
    console.log(chalk.green(PROFILE_DELETED), profile);

    return true;
};

export const setProfile = (profile: string, alert = false): void => {
    if (profileExists(profile)) {
        fs.writeFileSync(constants.GPM_CURRENT_PROFILE_FILE_LOCATION, profile);
        // TODO: Overwrite the content of gradle.properties with those
        // inside of this profile + global
        if (alert) {
            console.log(chalk.green(PROFILE_SWITCHED), profile);
        }
    } else {
        console.log(chalk.red(PROFILE_SWITCH_FAILED), profile);
        process.exit(1);
    }
};

export const getAllProfileNames = (): string[] => {
    const gpmHomeFiles: Dirent[] = fs.readdirSync(
        constants.GPM_HOME_DIRECTORY_LOCATION,
        {
            withFileTypes: true,
        }
    );
    const profiles: string[] = gpmHomeFiles
        .filter((dir: Dirent): boolean => {
            return (
                path.extname(dir.name) ==
                    `.${constants.PROPERTIES_FILE_EXTENSION}` &&
                dir.name != constants.GPM_GLOBAL_PROPERTIES_FILE_NAME
            );
        })
        .map((dir: Dirent): string => path.parse(dir.name).name);

    return profiles;
};

export const listAllProfiles = (): void => {
    const currentProfile = getCurrentProfileName();
    const profiles = getAllProfileNames();
    profiles.forEach((profile) => {
        if (profile != currentProfile) {
            console.log(chalk.blueBright(profile));
        } else {
            console.log(chalk.cyanBright.bold(profile));
        }
    });
};

const MUST_DEFINE = "Parameter '%s' must be defined";
const CANT_BE_EMPTY = "Parameter '%s' cannot be empty";
export const assertNotNullOrEmpty = (value: string, name: string): void => {
    if (!value) {
        console.log(chalk.red(MUST_DEFINE), name);
        process.exit(1);
    }

    if (value.length == 0 || value.trim().length == 0) {
        console.log(chalk.red(CANT_BE_EMPTY), name);
        process.exit(1);
    }
};

export const gpmInitialized = (): boolean => {
    // TODO: Account for incomplete initialization. For example,
    // if the .gpm home directory has been created, that doesn't
    // necessarily mean there's an active profile and respective
    // gpm-controlled gradle.properties file

    if (fs.existsSync(constants.GPM_HOME_DIRECTORY_LOCATION)) {
        return true;
    }

    let gradlePropertiesFileContent: string;
    if (fs.existsSync(constants.GRADLE_PROPERTIES_FILE_LOCATION)) {
        gradlePropertiesFileContent = fs.readFileSync(
            constants.GRADLE_PROPERTIES_FILE_LOCATION,
            'utf-8'
        );
    } else {
        return false;
    }

    if (gradlePropertiesFileContent.includes(constants.GPM_ANNOTATION)) {
        return true;
    }

    return false;
};

const NOT_INITIALIZED = 'gpm not yet initialized';
export const assertGpmInitialized = (): void => {
    if (!gpmInitialized()) {
        console.log(chalk.red(NOT_INITIALIZED));
        process.exit(1);
    }
};

export const writePropertyToProfile = (
    profile: string,
    key: string,
    value: string
): void => {};
