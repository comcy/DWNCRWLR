import * as minimist from 'minimist';

export class Cli {

    constructor() { }

    public readArgs(): any {
        const args = minimist(process.argv.slice(2));      
        console.log('args: ', args);
        return args;
    }

    // public getInput(args: string[]): string {
    //     const input: string = args.i; // -i: input parameter
    //     return input
    // }

}
