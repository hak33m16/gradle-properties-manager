import * as fs from 'fs';

import chalk from 'chalk';

const NOT_LOADED = "Properties file '%s' has not been loaded yet";
const ALREADY_LOADED = "Properties file '%s' has already been loaded";
const FILE_DOESNT_EXIST = "File '%s' does not exist";

export type Properties = {
    [key: string]: string;
};

export class PropertiesFile {
    private path: fs.PathLike;
    private properties: Properties = {};
    private loaded: boolean = false;

    constructor(path: fs.PathLike) {
        this.path = path;
    }

    load = (force: boolean): void => {
        if (this.loaded && !force) {
            console.log(chalk.red(ALREADY_LOADED), this.path);
            process.exit(1);
        }

        if (fs.existsSync(this.path)) {
            console.log(chalk.red(FILE_DOESNT_EXIST), this.path);
            process.exit(1);
        }

        // TODO: Implement .properties file deserializer
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
    public getProperty(key: string): string {
        if (!this.loaded) {
            console.log(chalk.red(NOT_LOADED), this.path);
        }

        return this.properties[key];
    }

    /**
     * setProperty
     */
    public setProperty(key: string, value: string): void {
        if (!this.loaded) {
            console.log(chalk.red(NOT_LOADED), this.path);
        }

        this.properties[key] = value;
    }
}
