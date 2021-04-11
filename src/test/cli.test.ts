const path = require('path');
const exec = require('child_process').exec;

// testing methodology from https://github.com/superflycss/cli
function cli(
    args: string[],
    cwd: string
): Promise<{ code: number; stdout: string; error: unknown; stderr: string }> {
    return new Promise((resolve) => {
        exec(
            `node ${path.resolve(
                './bin/gradle-properties-manager'
            )} ${args.join(' ')}`,
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
            const result = await cli(['property', 'set', 'a', 'b'], '.');
            expect(result.code).toBe(0);
            expect(result.stdout).toContain('Success');
        });
        it('sets secret property passed in with cli', async () => {
            const result = await cli(['property', 'set', 'a', 'b', '-s'], '.');
            expect(result.code).toBe(0);
            expect(result.stdout).toContain('Success');
        });
    });
});
