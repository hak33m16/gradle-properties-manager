import {
    PropertiesFile,
    Property,
    PropertyType,
} from '../../properties/properties-types';
import * as common from '../../common';
import * as constants from '../../constants';

export const getPropertyValue = (
    key: string,
    global: boolean,
    profile: string,
    decode: boolean
): string | undefined => {
    // TODO: Support global properties

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
            return decode
                ? Buffer.from(property.value, 'base64').toString()
                : property.value;
    }
};
