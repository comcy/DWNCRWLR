import 'jasmine';
import { Cli } from "../../../src/cli/cli";
import * as minimist from 'minimist';

describe("Cli", function () {

    const cli = new Cli();

    const inputArray = ['a', 'b', '-i', 'value'];
    console.log('inputArray', inputArray);

    const args = minimist(inputArray.slice(2));
    console.log('args', args);

    const nullArgs = minimist([]);

    // it("getInput() parameter with input flag '-i' is set", function () {

    //     console.log('test', cli.getInput(args));

    //     expect(cli.getInput(args)).toBe('');
    // });


    // it("getInput() parameter with input flag '-i' is NOT set", function () {
    //     expect(function () { cli.getInput(nullArgs); }).toThrow(new Error('No input parameter set.'));
    // });

});
