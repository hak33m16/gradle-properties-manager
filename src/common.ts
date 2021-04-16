import fs from 'fs';
import { Dirent } from 'node:fs';
import path from 'path';
import * as constants from './constants';

export const log = (message: string, level: number): void => {
    console.log(message, level);
};

export const getCurrentProfileName = (): string => {
    return fs.readFileSync(constants.GPM_CURRENT_PROFILE_FILE_LOCATION, {
        encoding: 'utf-8',
    });
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
        throw new Error(
            `Can't create profile '${profile}' as it already exists`
        );
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

export const setProfile = (profile: string): void => {
    if (profileExists(profile)) {
        fs.writeFileSync(constants.GPM_CURRENT_PROFILE_FILE_LOCATION, profile);
        // TODO: Overwrite the content of gradle.properties with those
        // inside of this profile + global
    } else {
        throw new Error(
            `Can't switch to profile '${profile}' as it doesn't exist`
        );
    }
};

export const getAllProfiles = (): string[] => {
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
        .map((dir: Dirent): string => path.basename(dir.name));

    return profiles;
};

export const writePropertyToProfile = (
    profile: string,
    key: string,
    value: string
): void => {};
