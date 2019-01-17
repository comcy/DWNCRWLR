import { isEmptyNullUndefined } from '../helpers';

export class Argument {

    private name: string;
    private input: string;
    private version: string;

    constructor(private args: string[]) {
        this.setInput(args[0]);
        this.setName();
        this.setVersion();
    }

    /**
     *
     */
    public getInput() {
        return this.input;
    }

    /**
     *
     * @param input
     */
    public setInput(input: string) {
        if (!isEmptyNullUndefined(input)) {
            this.input = input;
        } else {
            throw new Error('No input parameter set.');
        }

    }

    /**
     *
     */
    public getVersion() {
        return this.version;
    }

    /**
     * This method returns the actual application `name`
     */
    public getName() {
        return this.name;
    }

    /**
     * This method prints the `name` and the `version` information of the application.
     */
    public printInformation() {
        // tslint:disable-next-line:no-console
        console.log(`${this.getName()} - version: ${this.getVersion()}`);
    }

    /**
     *
     */
    private setVersion() {
        this.version = this.getPackageJson().version;
    }

    /**
     * This method sets the name of the application.
     * The `name` is set per default as extracted information form `package.json`
     */
    private setName() {
        this.name = this.getPackageJson().name;
    }

    /**
     * This method loads the `package.json` of the application
     */
    private getPackageJson() {
        // TODO env for Prod and Dev
        const pckg = require('../../package.json');
        return pckg;
    }
}
