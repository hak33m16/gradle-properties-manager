import {
    PropertiesFile,
    PropertyType,
} from '../../properties/properties-types';
import * as common from '../../common';
import * as constants from '../../constants';

export const setProperty = (
    key: string,
    value: string,
    secret: boolean,
    global: boolean,
    profile: string
): boolean => {
    // TODO: Support global properties

    new PropertiesFile(
        global
            ? common.getProfilePropertiesPath(constants.GPM_GLOBAL_PROFILE_NAME)
            : common.getProfilePropertiesPath(profile)
    )
        .load()
        .setPropertyValue(
            key,
            value,
            // TODO: Consider allowing them to pass in a type string and casting to enum
            secret ? PropertyType.secret : PropertyType.default
        )
        .save();

    if (profile == common.getCurrentProfileName()) {
        common.compileGradleProperties(profile);
    }

    return true;
};
