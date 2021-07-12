import chalk from 'chalk';
import * as constants from '../../constants';

export const ALREADY_INITIALIZED = chalk.red(
    "You've already initialized gpman..."
);

export const BACKUP_ALREADY_EXISTS = chalk.red(
    `Backup file '${constants.GRADLE_PROPERTIES_BAK_FILE_NAME}' already exists...`
);

export const BACKUP_CREATED = chalk.green(
    `Successfully backed up '${constants.GRADLE_PROPERTIES_FILE_NAME}' to \
'${constants.GRADLE_PROPERTIES_BAK_FILE_NAME}'...`
);

export const BACKUP_FAILED = chalk.red(
    `Failed to backup existing '${constants.GRADLE_PROPERTIES_FILE_NAME}'...`
);

export const BACKUP_PROPERTIES_FILE =
    chalk.yellow('[WARN]') +
    ` File '${constants.GRADLE_PROPERTIES_FILE_NAME}' already exists, would \
you like to create a backup at '${constants.GRADLE_PROPERTIES_FILE_NAME}.bak'?`;

export const CREATE_PROFILE = 'Enter name to use for initial profile';

export const GRADLE_NOT_FOUND = chalk.red(
    `Directory: '${constants.GRADLE_HOME_DIRECTORY_LOCATION}' not found - Gradle may not be installed`
);
