import {
    PropertiesFile,
    PropertyType,
} from '../../properties/properties-types';
import * as common from '../../common';
import * as constants from '../../constants';

export const setProperty = (
    key: string,
    value: string,
    encoded: boolean,
    masked: boolean,
    global: boolean,
    profile: string
): boolean => {
    let type: PropertyType = PropertyType.default;
    if (encoded) {
        type = PropertyType.secret;
    } else if (masked) {
        type = PropertyType.masked;
    }

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
            type
        )
        .save();

    common.compileGradleProperties(common.getCurrentProfileName());

    return true;
};
