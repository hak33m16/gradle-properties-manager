import os from 'os';
import path from 'path';

export const USER_HOME = os.homedir();
export const GRADLE_HOME_DIRECTORY_NAME = '.gradle';
export const GRADLE_HOME_DIRECTORY_LOCATION = path.join(
    USER_HOME,
    GRADLE_HOME_DIRECTORY_NAME
);
export const GRADLE_PROPERTIES_FILE_NAME = 'gradle.properties';
export const GRADLE_PROPERTIES_FILE_LOCATION = path.join(
    GRADLE_HOME_DIRECTORY_LOCATION,
    GRADLE_PROPERTIES_FILE_NAME
);
export const GPM_HOME_DIRECTORY_NAME = '.gpm';
export const GPM_HOME_DIRECTORY_LOCATION = path.join(
    USER_HOME,
    GPM_HOME_DIRECTORY_NAME
);
export const GPM_GLOBAL_PROPERTIES_FILE_NAME = 'global.properties';
export const GPM_DEFAULT_PROFILE_NAME = 'default';
export const GPM_CURRENT_PROFILE_FILE_MARKER = '.currentprofile';
export const PROPERTIES_FILE_EXTENSION = 'properties';
