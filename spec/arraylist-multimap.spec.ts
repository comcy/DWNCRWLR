
import 'jasmine';
import { ArrayListMultimap } from "../src/helpers/arraylist-multimap";

const arrayList = new ArrayListMultimap<string, string>();

arrayList.put('one', '1');
arrayList.put('two', '2');
arrayList.put('three', '3');

describe("ArrayList Multimap", function () {
    it("contains a key named 'one'", function () {
        expect(arrayList.containsKey('one')).toBe(true);
    });
});