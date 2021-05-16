import fs from 'fs';
import path from 'path';

const STATES_DIR = path.join('src', 'test', 'resources', 'states');

// https://stackoverflow.com/a/64255382
async function copyDir(src: string, dest: string) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        entry.isDirectory()
            ? copyDir(srcPath, destPath)
            : fs.copyFileSync(srcPath, destPath);
    }
}

export const useState = (state: string, destination: string): void => {
    if (!fs.existsSync(path.join(STATES_DIR, state))) {
        throw Error(`Invalid state: ${state}`);
    }

    copyDir(
        path.join(STATES_DIR, state, 'gpm'),
        path.join(destination, '.gpm')
    );
    copyDir(
        path.join(STATES_DIR, state, 'gradle'),
        path.join(destination, '.gradle')
    );
};
