/**
 * This method checks if a given value is `null`, `''` or `undefined`.
 * @param value, to check wheter it is `null` or `''` or `undefined`
 */
export const isEmptyNullUndefined = (
    value: any
) => {
    if(value === null) return true;
    if(value === '') return true;
    if(value === undefined) return true;
    return false;
};