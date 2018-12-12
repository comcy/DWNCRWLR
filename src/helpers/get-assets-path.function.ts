import { isEmptyNullUndefined } from "./index";

export const getAssetsPath = (
    assets: string
) => {

    if (!isEmptyNullUndefined(assets)) {
        return assets;
    } else {
        return './assets';
    }
};