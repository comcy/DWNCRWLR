import { isEmptyNullUndefined } from "./index";

export const DEFAULT_ACTUAL_PATH = './';
export const DEFAULT_ASSETS_PATH = 'assets';

export const getAssetsPath = (
    srcPath: string,
    assets: string
) => {

    if (!isEmptyNullUndefined(assets)) {
        return [srcPath, assets];
    } else {
        return [DEFAULT_ACTUAL_PATH, DEFAULT_ASSETS_PATH];
    }
};