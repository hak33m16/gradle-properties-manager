import table from 'text-table';
import chalk from 'chalk';
import stripAnsi from 'strip-ansi';

import * as common from '../../common';
import * as constants from '../../constants';
import {
    PropertiesFile,
    PropertyType,
} from '../../properties/properties-types';

export const listProperties = (profile: string, global: boolean): void => {
    const globalProperties = new PropertiesFile(
        constants.GPM_GLOBAL_PROPERTIES_FILE_LOCATION
    ).load();
    const profileProperties: PropertiesFile = new PropertiesFile(
        common.getProfilePropertiesPath(profile)
    ).load();

    let globalPropertyWasOverridden = false;

    const getPropertiesTable = (
        file: PropertiesFile,
        isGlobal = false
    ): string[][] => {
        const propertiesList: string[][] = [
            [chalk.green('Key'), chalk.green('Value')],
        ];

        file.getProperties().forEach((prop) => {
            const overriddenByProfile = isGlobal
                ? false
                : globalProperties.getProperty(prop.key) != undefined;
            globalPropertyWasOverridden =
                globalPropertyWasOverridden || overriddenByProfile;

            const key = overriddenByProfile
                ? `${prop.key} ${chalk.blueBright('(*)')}`
                : prop.key;
            const value =
                prop.type == PropertyType.secret
                    ? `${Buffer.from(prop.value).toString(
                          'base64'
                      )} ${chalk.gray('(secret)')}`
                    : prop.value;
            propertiesList.push([key, value]);
        });

        return propertiesList;
    };

    if (global) {
        console.log(chalk.green('[global]'));
        console.log(
            table(getPropertiesTable(globalProperties, true), {
                stringLength: (s) => stripAnsi(s).length,
            })
        );
        console.log();
    }

    console.log(chalk.green(`[${profile}]`));
    console.log(
        table(getPropertiesTable(profileProperties), {
            stringLength: (s) => stripAnsi(s).length,
        })
    );

    if (globalPropertyWasOverridden) {
        console.log();
        console.log(chalk.blueBright('*'), '=', 'overriding global property');
    }
};
