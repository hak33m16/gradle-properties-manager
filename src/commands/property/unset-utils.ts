import * as common from '../../common';
import * as constants from '../../constants';
import { PropertiesFile } from '../../properties/properties-types';

export const removeProperty = (
    key: string,
    profile: string,
    global: boolean
): void => {
    if (global) {
        new PropertiesFile(constants.GPM_GLOBAL_PROPERTIES_FILE_LOCATION)
            .load()
            .removeProperty(key)
            .save();
    } else {
        new PropertiesFile(common.getProfilePropertiesPath(profile))
            .load()
            .removeProperty(key)
            .save();
    }

    common.compileGradleProperties(common.getCurrentProfileName());
};
