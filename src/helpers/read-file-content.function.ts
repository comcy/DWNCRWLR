import * as fs from 'fs-extra';

/**
 * 
 * @param path 
 * @param fileName 
 * @param encoding 
 */
export const readFileContents = (
  path: string,
  fileName: string,
  encoding: string = 'utf-8'
) => {
  return fs.readFileSync(`${path}/${fileName}`, encoding);
};