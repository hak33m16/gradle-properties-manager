import chalk from 'chalk';
import * as fs from 'fs';

import * as constants from '../constants';
import * as messages from './properties-types-text';
import * as common from '../common';

import { PropertiesFormat, Property, PropertyType } from './properties-types';
import { PathLike } from 'node:fs';

const locations = (substring: string, str: string): number[] => {
    const numbers: number[] = [];
    let i: number = -1;
    while ((i = str.indexOf(substring, i + 1)) >= 0) {
        numbers.push(i);
    }
    return numbers;
};

// Aims to support the spec provided here (with annotations to support types):
// https://docs.oracle.com/javase/7/docs/api/java/util/Properties.html#load(java.io.Reader)
//
// Currently only supports a very small subset of the spec
export const handleLoad = (
    propertiesPath: fs.PathLike
): Map<string, Property> => {
    if (!fs.existsSync(propertiesPath)) {
        console.log(chalk.red(messages.FILE_DOESNT_EXIST), propertiesPath);
        process.exit(1);
    }

    const propertiesFileStr = fs
        .readFileSync(propertiesPath, {
            encoding: 'utf-8',
        })
        .trim();

    // Split properties file string into comment strings & property k/v arrays
    const lines = propertiesFileStr.split(/[\r?\n]+/).map((line) => {
        if (line.startsWith(constants.PROPERTIES_COMMENT)) {
            return line;
        }

        const separatorLocations = locations(
            constants.PROPERTIES_SEPARATOR,
            line
        );
        // Account for escaped separators
        while (separatorLocations.length > 0) {
            const prevChar: string | undefined =
                line[separatorLocations[0] - 1];
            if (!prevChar?.startsWith('\\')) {
                const key = line.substring(0, separatorLocations[0]).trim();
                const value = line
                    .substring(separatorLocations[0] + 1, line.length)
                    .trim();
                return [key, value];
            }

            separatorLocations.shift();
        }

        // Key with no value
        return [line, ''];
    });

    const properties: Map<string, Property> = new Map();
    // Deserialize all property entries into a Property object
    for (let i = 0; i < lines.length; ++i) {
        if (Array.isArray(lines[i])) {
            const key = lines[i][0];

            let type = PropertyType.default;

            const previousLine = lines[i - 1];
            // Previous line is a comment (non-arrays must be comments)
            if (typeof previousLine === 'string') {
                if (previousLine.startsWith(constants.GPM_TYPE_ANNOTATION)) {
                    const typeString = previousLine.split('=')[1];
                    type =
                        PropertyType[typeString as keyof typeof PropertyType];
                }
            }

            let value: string = lines[i][1];
            switch (type) {
                case PropertyType.default:
                    break;
                case PropertyType.secret:
                    value = Buffer.from(value, 'base64').toString();
                    break;
                default:
                    throw new Error(
                        `Cannot load unrecognized property type: ${type}`
                    );
            }

            properties.set(key, new Property(key, value, type));
        }
    }

    return properties;
};

export const handleSave = (
    properties: Map<string, Property>,
    path: PathLike,
    format: PropertiesFormat
): void => {
    const lines: string[] = [
        constants.GPM_ANNOTATION,
        constants.GPM_API_VERSION_ANNOTATION,
    ];
    properties.forEach((prop) => {
        if (format == PropertiesFormat.gpm) {
            switch (prop.type) {
                case PropertyType.default:
                    lines.push(
                        prop.key +
                            ` ${constants.PROPERTIES_SEPARATOR} ` +
                            prop.value
                    );
                    break;
                case PropertyType.secret:
                    lines.push(common.getPropertyTypeAnnotation(prop.type));
                    lines.push(
                        prop.key +
                            ` ${constants.PROPERTIES_SEPARATOR} ` +
                            Buffer.from(prop.value).toString('base64')
                    );
                    break;
                default:
                    throw Error(
                        `Can't save unknown property type: ${prop.type}`
                    );
            }
        } else if (format == PropertiesFormat.gradle) {
            lines.push(
                prop.key + ` ${constants.PROPERTIES_SEPARATOR} ` + prop.value
            );
        } else {
            throw Error("Can't save unrecognized properties file format");
        }
    });

    fs.writeFileSync(path, lines.join('\n'), { encoding: 'utf-8' });
};
