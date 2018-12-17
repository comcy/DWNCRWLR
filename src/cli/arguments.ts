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

    // constructor(input: string) {
    //     this.setInput(input);
    //     this.setName();
    //     this.setVersion();
    // }


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
     * 
     */
    getName() {
        return this.name;
    }


    /**
     * 
     */
    setName() {
        this.name = this.getPackageJson().name;
    }


    /**
     * 
     */
    getPackageJson(){
        // TODO env for Prod and Dev
        const pckg = require('../../package.json');
        return pckg;
    }


    /**
     * 
     */
    printInformation() {
        console.log(`${this.getName()} - version: ${this.getVersion()}`)
    }

} 