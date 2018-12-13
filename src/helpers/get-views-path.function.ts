import { isEmptyNullUndefined } from "./index";

export const DEFAULT_ACTUAL_PATH = './';
export const DEFAULT_VIEWS_PATH = 'views/layouts';

export const getViewsPath = (
    srcPath: string,
    views: string
) => {

    if (!isEmptyNullUndefined(views)) {
        return [srcPath, views];
    } else {
        return [DEFAULT_ACTUAL_PATH, DEFAULT_VIEWS_PATH];
    }
};