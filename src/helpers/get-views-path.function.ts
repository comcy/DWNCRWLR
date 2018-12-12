import { isEmptyNullUndefined } from "./index";

export const DEFAULT_VIEWS_PATH = './views/layouts';

export const getViewsPath = (
    views: string
) => {

    if (!isEmptyNullUndefined(views)) {
        return views;
    } else {
        return DEFAULT_VIEWS_PATH;
    }
};