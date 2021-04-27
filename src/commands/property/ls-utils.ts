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
    let propertyWasMasked = false;
    let secretWasMasked = false;

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

            let value: string;
            switch (prop.type) {
                case PropertyType.secret:
                    prop.type == PropertyType.secret;
                    value = chalk.gray('(secret)');
                    secretWasMasked = true;
                    break;
                case PropertyType.default:
                    value = prop.value;
                    break;
                case PropertyType.masked:
                    value = `${prop.value.replace(/./g, '*')} ${chalk.gray(
                        '(masked)'
                    )}`;
                    propertyWasMasked = true;
                    break;
                default:
                    throw Error(
                        `Can't display unknown property type: ${prop.type}`
                    );
            }
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

    const legend: string[][] = [];
    if (globalPropertyWasOverridden) {
        legend.push([chalk.blueBright('*'), 'overriding global property']);
    }
    if (propertyWasMasked) {
        legend.push([
            chalk.blueBright('masked'),
            `property was set with ${chalk.cyanBright('--masked')} flag`,
        ]);
    }
    if (secretWasMasked) {
        legend.push([
            chalk.blueBright('secret'),
            `property was set with ${chalk.cyanBright('--encoded')} flag`,
        ]);
    }

    if (legend.length > 0) {
        console.log();
        console.log(
            table(legend, {
                stringLength: (s) => stripAnsi(s).length,
            })
        );
    }
};
