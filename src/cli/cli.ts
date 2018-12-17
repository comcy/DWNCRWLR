/**
 * 
 */
export class Cli {

    args: string[] = [];

    constructor() {
        this.setCliArgs();
    }

    setCliArgs() {
        this.args = process.argv.slice(2);
    }


    getCliArgs(){
        return this.args;
    }
}