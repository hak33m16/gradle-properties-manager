import fs from 'fs';
import { Dirent, PathLike } from 'node:fs';
import path from 'path';

import chalk from 'chalk';

import * as constants from './constants';
import {
    PropertiesFile,
    PropertiesFormat,
    PropertyType,
} from './properties/properties-types';
import inquirer from 'inquirer';

const PROFILE_SWITCHED = 'Profile switched to: %s';
const PROFILE_SWITCH_FAILED =
    "Can't switch to profile '%s' as it doesn't exist";
const PROFILE_ALREADY_EXISTS = "Profile '%s' already exists";
const PROFILE_DOESNT_EXIST = "Profile '%s' does not exist";
const CANT_DELETE_CURRENT_PROFILE =
    "Can't delete profile '%s' as that's the current profile";
const PROFILE_DELETED = 'Sucessfully deleted profile: %s';
const PROFILE_CREATED = 'Successfully created profile: %s';

export const log = (message: string, level: number): void => {
    console.log(message, level);
};

export const getCurrentProfileName = (): string => {
    assertGpmInitialized();

    return fs.readFileSync(constants.GPM_CURRENT_PROFILE_FILE_LOCATION, {
        encoding: 'utf-8',
    });
};

export const getProfileFileLocation = (profile: string): string => {
    return path.join(
        constants.GPM_HOME_PATH,
        `${profile}.${constants.PROPERTIES_FILE_EXTENSION}`
    );
};

export const profileExists = (profile: string): boolean => {
    if (profile == constants.GPM_GLOBAL_PROFILE_NAME) {
        throw new Error(
            `'${profile}' is not a valid profile, it's the global properties store`
        );
    }

    const profileLocation: string = path.join(
        constants.GPM_HOME_PATH,
        `${profile}.${constants.PROPERTIES_FILE_EXTENSION}`
    );

    return fs.existsSync(profileLocation);
};

export const createGlobalProfile = (): void => {
    if (!fs.existsSync(constants.GPM_GLOBAL_PROPERTIES_FILE_LOCATION)) {
        fs.writeFileSync(
            constants.GPM_GLOBAL_PROPERTIES_FILE_LOCATION,
            `${constants.GPM_ANNOTATION}\n${constants.GPM_API_VERSION_ANNOTATION}`,
            { encoding: 'utf-8' }
        );
    }
};

export const createProfile = (profile: string, alert = false): void => {
    // TODO: Add in file name validation

    if (profileExists(profile)) {
        console.log(chalk.red(PROFILE_ALREADY_EXISTS), profile);
        process.exit(1);
    } else {
        fs.writeFileSync(
            path.join(
                constants.GPM_HOME_PATH,
                `${profile}.${constants.PROPERTIES_FILE_EXTENSION}`
            ),
            `${constants.GPM_ANNOTATION}\n${constants.GPM_API_VERSION_ANNOTATION}`,
            { encoding: 'utf-8' }
        );
    }

    if (alert) {
        console.log(chalk.green(PROFILE_CREATED), profile);
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

export const compileGradleProperties = (profile: string): void => {
    const profilePropertiesFile = new PropertiesFile(
        getProfilePropertiesPath(profile)
    ).load();

    const global = new PropertiesFile(
        constants.GPM_GLOBAL_PROPERTIES_FILE_LOCATION
    ).load();

    new PropertiesFile(
        constants.GRADLE_PROPERTIES_FILE_LOCATION,
        PropertiesFormat.gpm
    )
        .load()
        .setProperties(global)
        .addProperties(profilePropertiesFile)
        .save();
};

export const setProfile = (profile: string, alert = false): void => {
    if (profileExists(profile)) {
        fs.writeFileSync(constants.GPM_CURRENT_PROFILE_FILE_LOCATION, profile);
    } else {
        console.log(chalk.red(PROFILE_SWITCH_FAILED), profile);
        process.exit(1);
    }

    compileGradleProperties(profile);

    if (alert) {
        console.log(chalk.green(PROFILE_SWITCHED), profile);
    }
};

export const getAllProfileNames = (): string[] => {
    const gpmHomeFiles: Dirent[] = fs.readdirSync(constants.GPM_HOME_PATH, {
        withFileTypes: true,
    });
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

    console.log(chalk.cyanBright.bold(currentProfile));
    profiles.forEach((profile) => {
        if (profile != currentProfile) {
            console.log(chalk.blueBright(profile));
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

    if (fs.existsSync(constants.GPM_HOME_PATH)) {
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

export const getCurrentProfilePropertiesPath = (): PathLike => {
    return path.join(
        constants.GPM_HOME_PATH,
        `${getCurrentProfileName()}.${constants.PROPERTIES_FILE_EXTENSION}`
    );
};

export const getProfilePropertiesPath = (profile: string): PathLike => {
    return path.join(
        constants.GPM_HOME_PATH,
        `${profile}.${constants.PROPERTIES_FILE_EXTENSION}`
    );
};

export const getPropertyTypeAnnotation = (type: PropertyType): string => {
    return (
        constants.GPM_TYPE_ANNOTATION +
        constants.PROPERTIES_SEPARATOR +
        type.toString()
    );
};

export const getAnnotationPropertyType = (annotation: string): PropertyType => {
    return PropertyType[
        annotation.split(
            constants.PROPERTIES_SEPARATOR
        )[1] as keyof typeof PropertyType
    ];
};

export const format = (str: string, ...args: any[]): string => {
    const marker = '%s';

    let formattedStr = str;
    args.forEach((arg) => {
        formattedStr = formattedStr.replace(marker, arg?.toString());
    });

    return formattedStr;
};

export const genericPrompt = async (message: string): Promise<string> => {
    const { value } = await inquirer.prompt([
        {
            type: 'input',
            name: 'value',
            message: message,
        },
    ]);

    if (!value) {
        console.log(chalk.red('Must provide a value'));
    }

    return value;
};

export const ENTER_ARG_VALUE = "Provide a value for arg '%s':";
export const resolveArg = async (
    value: string,
    name: string
): Promise<string> => {
    return value ? value : await genericPrompt(format(ENTER_ARG_VALUE, name));
};
