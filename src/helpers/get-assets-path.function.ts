import { isEmptyNullUndefined } from "./index";

export const DEFAULT_ASSETS_PATH = './assets';

export const getAssetsPath = (
    srcPath: string,
    assets: string
) => {

    if (!isEmptyNullUndefined(assets)) {
        return [srcPath, assets];
    } else {
        return ['', DEFAULT_ASSETS_PATH];
    }
};