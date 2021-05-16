import os from 'os';
import path from 'path';

export const USER_HOME = os.homedir();
// https://docs.gradle.org/current/userguide/build_environment.html#sec:gradle_configuration_properties
export const GRADLE_USER_HOME = process.env.GRADLE_USER_HOME;
export const GRADLE_HOME_DIRECTORY_NAME = '.gradle';
// Consider adding logging functionality for when we use the environment variable
export const GRADLE_HOME_DIRECTORY_LOCATION =
    GRADLE_USER_HOME ?? path.join(USER_HOME, GRADLE_HOME_DIRECTORY_NAME);
export const GRADLE_PROPERTIES_FILE_NAME = 'gradle.properties';
export const GRADLE_PROPERTIES_FILE_LOCATION = path.join(
    GRADLE_HOME_DIRECTORY_LOCATION,
    GRADLE_PROPERTIES_FILE_NAME
);
export const GRADLE_PROPERTIES_BAK_FILE_NAME = 'gradle.properties.bak';
export const GRADLE_PROPERTIES_BAK_FILE_LOCATION = path.join(
    GRADLE_HOME_DIRECTORY_LOCATION,
    `${GRADLE_PROPERTIES_FILE_NAME}.bak`
);
export const GPM_HOME_DIRECTORY_NAME = '.gpm';
export const GPM_USER_HOME = process.env.GPM_USER_HOME;
// Consider adding logging functionality for when we use the environment variable
export const GPM_HOME_PATH =
    GPM_USER_HOME ?? path.join(USER_HOME, GPM_HOME_DIRECTORY_NAME);
export const GPM_GLOBAL_PROPERTIES_FILE_NAME = 'global.properties';
export const GPM_GLOBAL_PROPERTIES_FILE_LOCATION = path.join(
    GPM_HOME_PATH,
    GPM_GLOBAL_PROPERTIES_FILE_NAME
);
export const GPM_GLOBAL_PROFILE_NAME = 'global';
export const GPM_DEFAULT_PROFILE_NAME = 'default';
export const GPM_CURRENT_PROFILE_FILE_NAME = 'profile';
export const GPM_CURRENT_PROFILE_FILE_LOCATION = path.join(
    GPM_HOME_PATH,
    GPM_CURRENT_PROFILE_FILE_NAME
);
export const PROPERTIES_FILE_EXTENSION = 'properties';
export const PROPERTIES_COMMENT = '#';
export const PROPERTIES_SEPARATOR = '=';
// See to reference properties file allowed comments:
// https://docs.oracle.com/javase/7/docs/api/java/util/Properties.html#load(java.io.Reader)
export const GPM_ANNOTATION = '#@gpm';
export const GPM_TYPE_ANNOTATION = '#@gpm-type';
export const GPM_API_VERSION_ANNOTATION = '#@gpm-api=v0beta1';
// TODO: Consider making this configurable to the user
export const SENSITIVE_KEY_PATTERNS = ['auth', 'pass'];
