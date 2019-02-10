/**
 *
 */
export class Cli {

    private args: string[] = [];

    constructor(pathName: string, inputParams: string[]) {
        this.setCliArgs(pathName, inputParams);
    }

    public setCliArgs(pathArg: string, inputArgs: string[]) {
        this.args.push(pathArg);
        this.args = this.args.concat(inputArgs);
    }

    public getCliArgs() {
        return this.args;
    }
}
