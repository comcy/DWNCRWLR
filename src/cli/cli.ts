/**
 * 
 */
export class Cli {

    args: string[] = [];

    constructor() { }

    /**
     * 
     */
    public readCli(): any {
        this.args =  process.argv.slice(2); 
        return this.args;
    }
}