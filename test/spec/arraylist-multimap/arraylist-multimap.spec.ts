import 'jasmine';
import { ArrayListMultimap } from "../../../src/helpers/arraylist-multimap";

const arrayList = new ArrayListMultimap<string, string>();

arrayList.put('one', '1');
arrayList.put('two', '2');
arrayList.put('three', '3');

describe("A suite", function () {
    it("contains spec with an expectation", function () {
        expect(arrayList.containsKey('one')).toBe(true);
    });
});