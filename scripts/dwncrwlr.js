/**
 * Static site generation build script: dwncrwlr.js
 */

const fs = require('fs-extra');
const config = require('../dwncrwlr.config.json');
const styles = require('./console-style')
const glob = require('glob');

// Variabel declaration defined in dwncrwlr.config.json
const srcPath = config.build.srcPath;
const srcPathPages = config.build.srcPathPages;
const distPath = config.build.distPath;

// Start of dwncrwlr script
console.log(styles.textFgRed, styles.asciiLogo);
console.log('\n', styles.textFgGreen);
console.log('//-----------------------------------------------------');
console.log('\t Starting static site generation');
console.log('//-----------------------------------------------------');
console.log('\n', styles.styleReset);

// Empty dist folder
fs.emptyDirSync(distPath);

// Copy required assets to dist folder
fs.copy(`${srcPath}/assets`, `${distPath}/assets`);

// Read in all files by specified pattern
console.log('Supported file extensions:');
console.log(styles.textFgGreen, `${config.build.supportedContentExtensionsPattern}`);

const files = glob.sync(`**/*.@(${config.build.supportedContentExtensionsPattern})`, { cwd: `${srcPath}/${srcPathPages}` });

console.log('\n', styles.styleReset);
console.log('Detected files:\n', files);



console.log('\n', styles.textFgGreen);
console.log('//-----------------------------------------------------');
console.log('\t Finished static site generation');
console.log('//-----------------------------------------------------');

