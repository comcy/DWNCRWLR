/**
 *
 */
export class Cli {

    private args: string[] = [];

    constructor() {
        this.setCliArgs();
    }

    public setCliArgs() {
        this.args = process.argv.slice(2);
    }

    public getCliArgs() {
        return this.args;
    }
}
