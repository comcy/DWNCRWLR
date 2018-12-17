import 'jasmine';
import { ArrayListMultimap } from "../../../src/helpers/arraylist-multimap";

const arrayList = new ArrayListMultimap<string, string>();

arrayList.put('one', '1');
arrayList.put('two', '2');
arrayList.put('three', '3');

describe("ArrayListMultimap", function () {
    
    it("contains a key named 'one'", function () {
        expect(arrayList.containsKey('one')).toBe(true);
    });

    it("contains a value named '1'", function () {
        expect(arrayList.containsValue('1')).toBe(true);
    });

    it("contains a entry with key 'one' and value '1'", function () {
        expect(arrayList.containsEntry('one', '1')).toBe(true);
    });

    it("contains a entry with a key and a value", function () {
        expect(arrayList.containsEntry('two', '2')).toBe(true);
    });
});
