import { isEmptyNullUndefined } from "./index";

export const DEFAULT_ASSETS_PATH = './assets';

export const getAssetsPath = (
    assets: string
) => {

    if (!isEmptyNullUndefined(assets)) {
        return assets;
    } else {
        return DEFAULT_ASSETS_PATH;
    }
};