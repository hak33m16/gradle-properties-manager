import * as fs from 'fs';

import chalk from 'chalk';

import * as constants from '../constants';

const NOT_LOADED = "Properties file '%s' has not been loaded yet";
const FILE_DOESNT_EXIST = "File '%s' does not exist";
const PROPERTY_ALREADY_EXISTS =
    "Property '%s' already exists, can't recreate it";

export enum PropertyType {
    default = 'default',
    secret = 'secret',
}

export class Property {
    public key: string;
    public value: string;
    public type: PropertyType;

    constructor(
        key: string,
        value: string,
        type: PropertyType = PropertyType.default
    ) {
        this.key = key;
        this.value = value;
        this.type = type;
    }
}

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
const handleLoad = (propertiesPath: fs.PathLike): Map<string, Property> => {
    if (!fs.existsSync(propertiesPath)) {
        console.log(chalk.red(FILE_DOESNT_EXIST), propertiesPath);
        process.exit(1);
    }

    const propertiesFileStr = fs
        .readFileSync(propertiesPath, {
            encoding: 'utf-8',
        })
        .trim();

    const lines = propertiesFileStr.split(/[\r?\n]+/).map((line) => {
        if (line.startsWith(constants.PROPERTIES_COMMENT)) {
            return line;
        }

        const separatorLocations = locations(
            constants.PROPERTIES_SPLITTER,
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
    for (let i = 0; i < lines.length; ++i) {
        if (Array.isArray(lines[i])) {
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

            properties.set(
                lines[i][0],
                new Property(lines[i][0], lines[i][1], type)
            );
        }
    }

    return properties;
};

export class PropertiesFile {
    private path: fs.PathLike;
    private properties: Map<string, Property> = new Map();
    private loaded: boolean = false;

    constructor(path: fs.PathLike) {
        this.path = path;
    }

    load = (): void => {
        this.properties = handleLoad(this.path);
        this.loaded = true;
    };

    save = (): void => {
        if (!this.loaded) {
            console.log(chalk.red(NOT_LOADED), this.path);
        }

        // TODO: Implement .properties file serializer
    };

    /**
     * getProperty
     */
    public getProperty(key: string): Property | undefined {
        return this.properties.get(key);
    }

    /**
     * setProperty
     */
    public setProperty(key: string, property: Property): void {
        this.properties.set(key, property);
    }

    /**
     * getPropertyValue
     */
    public getPropertyValue(key: string): string | undefined {
        if (!this.loaded) {
            console.log(chalk.red(NOT_LOADED), this.path);
        }

        return this.properties.get(key)?.value;
    }

    /**
     * setPropertyValue
     */
    public setPropertyValue(
        key: string,
        value: string,
        type: PropertyType = PropertyType.default
    ): void {
        if (!this.loaded) {
            console.log(chalk.red(NOT_LOADED), this.path);
        }

        const prop = this.properties.get(key);
        if (prop) {
            prop.value = value;
        } else {
            this.properties.set(key, new Property(key, value, type));
        }
    }
}
