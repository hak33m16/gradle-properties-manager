import * as fs from 'fs';

import * as propertiesUtils from './properties-types-utils';

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

export class PropertiesFile {
    private path: fs.PathLike;
    private properties: Map<string, Property> = new Map();
    private loaded: boolean = false;

    constructor(path: fs.PathLike) {
        this.path = path;
    }

    private assertLoaded() {
        if (!this.loaded) {
            const message = `Properties file ${this.path} has not been loaded yet`;
            throw Error(message);
        }
    }

    load = (): PropertiesFile => {
        this.properties = propertiesUtils.handleLoad(this.path);
        this.loaded = true;
        return this;
    };

    save = (): PropertiesFile => {
        this.assertLoaded();
        propertiesUtils.handleSave(this.properties, this.path);
        return this;
    };

    /**
     * getProperty
     */
    public getProperty(key: string): Property | undefined {
        this.assertLoaded();

        return this.properties.get(key);
    }

    /**
     * setProperty
     */
    public setProperty(key: string, property: Property): PropertiesFile {
        this.assertLoaded();

        this.properties.set(key, property);
        return this;
    }

    /**
     * getPropertyValue
     */
    public getPropertyValue(key: string): string | undefined {
        this.assertLoaded();

        return this.properties.get(key)?.value;
    }

    /**
     * setPropertyValue
     */
    public setPropertyValue(
        key: string,
        value: string,
        type: PropertyType = PropertyType.default
    ): PropertiesFile {
        this.assertLoaded();

        const prop = this.properties.get(key);
        if (prop) {
            prop.value = value;
            prop.type = type;
        } else {
            // TODO: Consider sanitizing the key before it goes into the file
            // so that people don't accidentally separate their key/value
            this.properties.set(key, new Property(key, value, type));
        }

        return this;
    }
}
