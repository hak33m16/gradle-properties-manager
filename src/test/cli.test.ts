import { ChildProcess } from 'node:child_process';
import fs from 'fs';
import * as uuid from 'uuid';

import * as utils from './utils';
import * as constants from '../constants';

const path = require('path');
const { exec, spawn } = require('child_process');

type CliResponse = {
    stdout: string;
    stderr: string;
    code: number;
};

const cmdStart = `node ${path.resolve('./bin/gradle-properties-manager')}`;

// testing methodology from https://github.com/superflycss/cli
function cli(
    args: string[],
    cwd = '.'
): Promise<{ code: number; stdout: string; error: unknown; stderr: string }> {
    return new Promise((resolve) => {
        exec(
            `${cmdStart} ${args.join(' ')}`,
            // TODO: Figure out why this isn't using the documented default
            // env of process.env: https://nodejs.org/api/child_process.html
            { cwd, env: process.env },
            (error: { code: number }, stdout: string, stderr: string) => {
                resolve({
                    code: error && error.code ? error.code : 0,
                    error,
                    stdout,
                    stderr,
                });
            }
        );
    });
}

let TEST_DIR: string;
// Setup fake gradle and gpm home directories
beforeEach(() => {
    TEST_DIR = path.join('build', 'test', uuid.v4());
    fs.mkdirSync(TEST_DIR, { recursive: true });

    const GRADLE_USER_HOME = path.join(
        TEST_DIR,
        constants.GRADLE_HOME_DIRECTORY_NAME
    );
    fs.mkdirSync(GRADLE_USER_HOME, { recursive: true });

    const GPM_USER_HOME = path.join(
        TEST_DIR,
        constants.GPM_HOME_DIRECTORY_NAME
    );
    // TODO: Delegate this responsibility to each test.
    // We'd like to test what happens when these don't exist
    fs.mkdirSync(GPM_USER_HOME, { recursive: true });

    process.env.GRADLE_USER_HOME = path.resolve(GRADLE_USER_HOME);
    process.env.GPM_USER_HOME = path.resolve(GPM_USER_HOME);
});

describe('Property', () => {
    describe('Set', () => {
        it('sets property passed in with cli', async () => {
            utils.useState('default-initialization', path.resolve(TEST_DIR));

            const { code, stdout, stderr } = await cli([
                'property',
                'set',
                'a',
                'b',
            ]);
            expect(stderr).toBe('');
            expect(code).toBe(0);
            expect(stdout).toContain('Success');
        });
        it('sets encoded property passed in with cli', async () => {
            utils.useState('default-initialization', path.resolve(TEST_DIR));

            const { code, stdout, stderr } = await cli([
                'property',
                'set',
                'a',
                'b',
                '-e',
            ]);
            expect(stderr).toBe('');
            expect(code).toBe(0);
            expect(stdout).toContain('Success');
        });
        it.todo('starts repl for key if no args passed');
        it.todo('starts repl for value if only key is passed');
    });
});
