import { ChildProcess } from 'node:child_process';

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
            { cwd },
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

describe('Property', () => {
    describe('Set', () => {
        it('sets property passed in with cli', async () => {
            const { code, stdout } = await cli(['property', 'set', 'a', 'b']);
            expect(code).toBe(0);
            expect(stdout).toContain('Success');
        });
        it('sets secret property passed in with cli', async () => {
            const { code, stdout } = await cli([
                'property',
                'set',
                'a',
                'b',
                '-s',
            ]);
            expect(code).toBe(0);
            expect(stdout).toContain('Success');
        });
        it.todo('starts repl for key if no args passed');
        it.todo('starts repl for value if only key is passed');
    });
});
