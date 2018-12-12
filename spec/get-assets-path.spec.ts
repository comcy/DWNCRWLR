import 'jasmine';
import { getAssetsPath, DEFAULT_ASSETS_PATH } from "./../src/helpers/get-assets-path.function";


describe("Check function: getAssetsPath()", function () {

    const customSrcValue = 'project';
    const customAssetsValue = 'assets';
    const emptyStringValue = '';

    it("value is ''", function () {
        expect(getAssetsPath(customSrcValue, emptyStringValue)).toEqual(['', DEFAULT_ASSETS_PATH]);
    });

    it("value is custom 'assets'", function () {
        expect(getAssetsPath(customSrcValue, customAssetsValue)).toEqual([customSrcValue, customAssetsValue]);
    });
});