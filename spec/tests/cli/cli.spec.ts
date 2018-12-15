import 'jasmine';
import { Cli } from "../../../src/cli/cli";
import * as minimist from 'minimist';

class Some {
    private args;
}

describe("Cli", function () {

    beforeEach(function () {

        const cli = new Cli();
        const inputArray = ['a', 'b', '-i', 'value'];
        console.log('asd', inputArray);
        this.args = minimist(inputArray.slice(2));
        const nullArgs = minimist([]);

    });


    // const nullArgs = minimist([]);;


    // it("readArgs() returns args", function () {
    //     expect(cli.readArgs()).toEqual(jasmine.any([]));
    // });



    it("getInput() parameter with input flag '-i' is set", function () {
        console.log(cli.getInput(this.args));
        expect(cli.getInput(this.args)).toBe('value');
    });

    it("getInput() parameter with input flag '-i' is NOT set", function () {
        expect(function () { cli.getInput(nullArgs); }).toThrow(new Error('No input parameter set.'));
    });

});
