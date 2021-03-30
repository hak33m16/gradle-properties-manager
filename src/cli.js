const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

let args = yargs(hideBin(process.argv))
    .command('serve [port]', 'start the server', (yargs) => {
        yargs
        .positional('port', {
            describe: 'port to bind on',
            default: 5000
        })
    }, (argv) => {
        if (argv.verbose) console.info(`start server on :${argv.port}`)
        serve(argv.port)
    })
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Run with verbose logging'
    })
    .option('init', {
        type: 'boolean',
        description: 'Initialize the Gradle properties manager'
    })
    .strictCommands()
    .argv

console.log(args)
console.log('Run with --help for details on usage')


