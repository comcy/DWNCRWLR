import { isEmptyNullUndefined } from '../helpers';

export class Argument {

    private name: string;
    private input: string;
    private version: string;

    constructor(args: string[]) {
        this.setInput(args[0]);
        this.setName();
        this.setVersion();
    }
    
    /**
     * 
     */
    getInput() {
        return this.input;
    }


    /**
     * 
     * @param input 
     */
    setInput(input: string) {
        if (!isEmptyNullUndefined(input)) {
            this.input = input;
        } else {
            throw new Error('No input parameter set.');
        }
        
    }


    /**
     * 
     */
    getVersion() {
        return this.version
    }


    /**
     * 
     */
    setVersion() {
        this.version = this.getPackageJson().version;
    }


    /**
     * This method returns the actual application `name`
     */
    getName() {
        return this.name;
    }


    /**
     * This method sets the name of the application.
     * The `name` is set per default as extracted information form `package.json`
     */
    setName() {
        this.name = this.getPackageJson().name;
    }


    /**
     * This method loads the `package.json` of the application 
     */
    getPackageJson(){
        // TODO env for Prod and Dev
        const pckg = require('../../package.json');
        return pckg;
    }


    /**
     * This method prints the `name` and the `version` information of the application.
     */
    printInformation() {
        console.log(`${this.getName()} - version: ${this.getVersion()}`)
    }

} 