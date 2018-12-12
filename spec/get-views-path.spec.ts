import 'jasmine';
import { getViewsPath, DEFAULT_VIEWS_PATH } from "./../src/helpers/get-views-path.function";


describe("Check function: getViewsPath()", function () {

    const customValue = '/views/layouts';
    const emptyStringValue = '';

    it("value is ''", function () {
        expect(getViewsPath(emptyStringValue)).toBe(DEFAULT_VIEWS_PATH);
    });

    it("value is custom '/views/layouts'", function () {
        expect(getViewsPath(customValue)).toBe(customValue);
    });
});