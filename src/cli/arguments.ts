import { isEmptyNullUndefined } from '../helpers';

export class Argument {


    private name: string;
    private input: string;
    private version: string;


    constructor(input: string) {
        this.setInput(input);
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
            console.log("asd", input)
            this.input = input;
        } else {
            console.log("asd2", input)
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