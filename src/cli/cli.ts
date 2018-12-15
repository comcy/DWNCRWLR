import * as minimist from 'minimist';
import { isEmptyNullUndefined } from "./../helpers/is-empty-null-undefined.function";

/**
 * 
 */
export class Cli {

    constructor() { }

    /**
     * 
     */
    public readArgs(): any {
        const args = minimist(process.argv.slice(2));
        console.log('args: ', args);
        return args;
    }

    /**
     * 
     * @param args 
     */
    public getInput(input): string {
        if (isEmptyNullUndefined(input)) {
            return input
        } else {
            throw new Error('No input parameter set.');
        }
    }

}
