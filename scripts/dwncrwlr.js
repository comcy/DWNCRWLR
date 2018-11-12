/**
 * Static site generation build script: dwncrwlr.js
 */

const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const ejs = require('ejs');
const marked = require('marked');
const showdown = require('showdown');
const frontMatter = require('front-matter');

const config = require('../dwncrwlr.config.json');
const styles = require('./console-style')


// Variabel declaration defined in dwncrwlr.config.json
const srcPath = config.build.srcPath;
const srcPathPages = config.build.srcPathPages;
const distPath = config.build.distPath;

// Start of dwncrwlr script
console.log(styles.textFgRed, styles.asciiLogo);
console.log('\n', styles.textFgMagenta);
console.log('//-----------------------------------------------------');
console.log('\t Starting static site generation');
console.log('//-----------------------------------------------------');
console.log('\n', styles.styleReset);

// 1. Empty dist folder
fs.emptyDirSync(distPath);

// 2. Copy required assets to dist folder
fs.copy(`${srcPath}/assets`, `${distPath}/assets`);

// 3. Read in all files by specified pattern
console.log('Supported file extensions:');
console.log(styles.textFgGreen, `${config.build.supportedContentExtensionsPattern}`);

const files = glob.sync(`**/*.@(${config.build.supportedContentExtensionsPattern})`, { cwd: `${srcPath}/${srcPathPages}` });

console.log('\n', styles.styleReset);
console.log('Detected files:\n', files);

// 4. Iterate through all files
files.forEach((file) => {

    // Read file information of every single file ...
    const fileInfo = path.parse(file); // get complete file info
    console.log(fileInfo); // TODO: remove later
    
    // ... and concatenate them with the dist folder path
    const fileCopyPath = path.join(distPath, fileInfo.dir)
    console.log(fileCopyPath); // TODO: remove later

    




});

console.log('\n', styles.textFgMagenta);
console.log('//-----------------------------------------------------');
console.log('\t Finished static site generation');
console.log('//-----------------------------------------------------');

