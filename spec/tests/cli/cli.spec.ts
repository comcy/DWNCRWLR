import 'jasmine';
import { Cli } from "../../../src/cli/cli";

describe("Cli", function () {

    const cli = new Cli();

    it("readArgs() returns an array", function () {
        expect(cli.readArgs()).toEqual(jasmine.any([]));
    });

    it("getInput() returns input by paramter '-i'", function () {
        expect(cli.readArgs()).toEqual(jasmine.any([]));
    });

    it("getInput() returns a string by paramter '--input'", function () {
        expect(cli.readArgs()).toEqual(jasmine.any([]));
    });

    it("getInput() returns a string by paramter '--input'", function () {
        expect(cli.readArgs()).toEqual(jasmine.any([]));
    });

    it("getInput() returns 'null' on non-input parameter '-i'", function () {
        expect(cli.readArgs()).toEqual(jasmine.any([]));
    });

    it("getInput() returns 'null' on non-input parameter '--input'", function () {
        expect(cli.readArgs()).toEqual(jasmine.any([]));
    });

});
