/**
 * Static site generation build script: dwncrwlr.js
 */

const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const ejs = require('ejs');
const showdown = require('showdown'),
    converter = new showdown.Converter();
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

    // 4.1. Prepare destination directories related to the given files 
    // Read file information of every single file ...
    const fileInfo = path.parse(file); // get complete file info
    // ... and concatenate them with the dist folder path and create the folders
    const fileCopyPath = path.join(distPath, fileInfo.dir)
    fs.mkdirpSync(fileCopyPath);

    // 4.2. Read file content and front-matter to render pages
    const pageFile = fs.readFileSync(`${srcPath}/${srcPathPages}/${file}`, 'utf-8');
    const pageData = frontMatter(pageFile);
    const templateConfig = Object.assign({}, config, {
        page: pageData.attributes
    });

    let pageContent;

    if (fileInfo.ext === '.md') {
        pageContent = converter.makeHtml(pageData.body);
    }
    if (fileInfo.ext === '.ejs') {
        // TODO: when needed
        console.log('TODO: EJS');
    }
    if (fileInfo.ext === '.html') {
        pageContent = pageData.body;
    }


    // TODO layouting, tags, stuff

    const finalPage = ejs.render(
        // layoutData,
        Object.assign({}, templateConfig, {
            body: pageContent
                // filename: layoutFileName
        })
    );

    // save the html file
    fs.writeFileSync(`${destPath}/${fileInfo.name}.html`, finalPage);

});

console.log('\n', styles.textFgMagenta);
console.log('//-----------------------------------------------------');
console.log('\t Finished static site generation');
console.log('//-----------------------------------------------------');