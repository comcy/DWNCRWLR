import 'jasmine';
import { getAssetsPath, DEFAULT_ASSETS_PATH, DEFAULT_ACTUAL_PATH } from "../../../src/helpers/get-assets-path.function";


describe("getAssetsPath()", function () {

    const customSrcValue = 'project';
    const customAssetsValue = 'assets';
    const emptyStringValue = '';

    const emptyCustomValue = [DEFAULT_ACTUAL_PATH, DEFAULT_ASSETS_PATH];
    const customValue = [customSrcValue, customAssetsValue];

    it("value is ''", function () {
        expect(getAssetsPath(customSrcValue, emptyStringValue)).toEqual(emptyCustomValue);
    });

    it("value is custom 'assets'", function () {
        expect(getAssetsPath(customSrcValue, customAssetsValue)).toEqual(customValue);
    });
});