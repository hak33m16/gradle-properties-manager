import {
    PropertiesFile,
    Property,
    PropertyType,
} from '../../properties/properties-types';
import * as common from '../../common';
import * as constants from '../../constants';
import chalk from 'chalk';

export const getPropertyValue = (
    key: string,
    global: boolean,
    profile: string,
    decode: boolean,
    unmask: boolean
): string | undefined => {
    const property: Property | undefined = new PropertiesFile(
        global
            ? common.getProfilePropertiesPath(constants.GPM_GLOBAL_PROFILE_NAME)
            : common.getProfilePropertiesPath(profile)
    )
        .load()
        .getProperty(key);

    if (!property) {
        return undefined;
    }

    switch (property.type) {
        case PropertyType.default:
            return property.value;
        case PropertyType.secret:
            // No actual decoding has to happen since property values aren't
            // encoded while in the Property object
            return decode ? property.value : chalk.gray('(secret)');
        case PropertyType.masked:
            return unmask
                ? property.value
                : `${property.value.replace(/./g, '*')} ${chalk.gray(
                      '(masked)'
                  )}`;
        default:
            throw Error(
                `Can't display unknown property type: ${property.type}`
            );
    }
};
