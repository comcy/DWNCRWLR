import 'jasmine';
import { getViewsPath, DEFAULT_VIEWS_PATH, DEFAULT_ACTUAL_PATH } from "../../../src/helpers/get-views-path.function";


describe("getViewsPath()", function () {

    const customSrcValue = './project';
    const customViewsValue = '/views/layouts';
    const emptyStringValue = '';

    const emptyCustomValue = [DEFAULT_ACTUAL_PATH, DEFAULT_VIEWS_PATH];
    const customValue = [customSrcValue, customViewsValue];

    it("value is ''", function () {
        expect(getViewsPath(customSrcValue, emptyStringValue)).toEqual(emptyCustomValue);
    });

    it("value is custom '/views/layouts'", function () {
        expect(getViewsPath(customSrcValue, customViewsValue)).toEqual(customValue);
    });
});