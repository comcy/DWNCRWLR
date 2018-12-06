
import 'jasmine';
import { ArrayListMultimap } from "../src/helpers/arraylist-multimap";

const arrayList = new ArrayListMultimap<string, string>();

arrayList.put('one', '1');
arrayList.put('two', '2');
arrayList.put('three', '3');

// CONTAINS KEY
describe("ArrayList Multimap", function () {
    it("contains a key named 'one'", function () {
        expect(arrayList.containsKey('one')).toBe(true);
    });
});


// CONTAINS VALUE
describe("ArrayList Multimap", function () {
    it("contains a value named '1'", function () {
        expect(arrayList.containsValue('1')).toBe(true);
    });
});


// CONTAINS ENTRY
describe("ArrayList Multimap", function () {
    it("contains a entry with key 'one' and value '1'", function () {
        expect(arrayList.containsEntry('one', '1')).toBe(true);
    });
});


// CONTAINS ALL ENTRIES
describe("ArrayList Multimap", function () {
    it("contains a entry with a key and a value", function () {
        expect(arrayList.containsEntry('one', '1')).toBe(true);
    });
});