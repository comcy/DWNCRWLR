import 'jasmine';
import { isEmptyNullUndefined } from "../../../src/helpers/is-empty-null-undefined.function";

describe("isEmptyNullUndefined()", function () {

    const nullValue = null;
    const emptyStringValue = '';
    const undefinedValue = undefined;
    const numberValue = 1;
    const stringValue = 'hello';

    it("value is ''", function () {
        expect(isEmptyNullUndefined(emptyStringValue)).toBe(true);
    });

    it("value is 'null'", function () {
        expect(isEmptyNullUndefined(nullValue)).toBe(true);
    });

    it("value is 'undefined'", function () {
        expect(isEmptyNullUndefined(undefinedValue)).toBe(true);
    });

    it("value is 'number'", function () {
        expect(isEmptyNullUndefined(numberValue)).toBe(false);
    });

    it("value is 'string'", function () {
        expect(isEmptyNullUndefined(stringValue)).toBe(false);
    });
});