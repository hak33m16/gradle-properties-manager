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
export const GRADLE_PROPERTIES_BAK_FILE_NAME = 'gradle.properties.bak';
export const GRADLE_PROPERTIES_BAK_FILE_LOCATION = path.join(
    GRADLE_HOME_DIRECTORY_LOCATION,
    `${GRADLE_PROPERTIES_FILE_NAME}.bak`
);
export const GPM_HOME_DIRECTORY_NAME = '.gpm';
export const GPM_HOME_PATH = path.join(USER_HOME, GPM_HOME_DIRECTORY_NAME);
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
