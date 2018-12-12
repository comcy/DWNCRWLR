import 'jasmine';
import { getAssetsPath, DEFAULT_ASSETS_PATH } from "./../src/helpers/get-assets-path.function";


describe("Check function: getAssetsPath()", function () {

    const customValue = 'assets';
    const emptyStringValue = '';

    it("value is ''", function () {
        expect(getAssetsPath(emptyStringValue)).toBe(DEFAULT_ASSETS_PATH);
    });

    it("value is custom 'assets'", function () {
        expect(getAssetsPath(customValue)).toBe(customValue);
    });
});