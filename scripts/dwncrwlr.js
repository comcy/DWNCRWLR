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
const moment = require('moment');

const config = require('../dwncrwlr.config.json');
const styles = require('./console-style');

// Variabel declaration defined in dwncrwlr.config.json
const srcPath = config.build.srcPath;
const srcPathSites = config.build.srcPathSites;
const srcPathLayouts = config.build.srcPathLayouts;
const distPath = config.build.distPath;

// Start of dwncrwlr script
console.log(styles.textFgRed, styles.asciiLogo);
console.log('\n', styles.textFgMagenta);
console.log('//-----------------------------------------------------');
console.log('\t Starting static site generation');
console.log('//-----------------------------------------------------');
console.log('\n', styles.styleReset);

// Empty dist folder and copy assets
fs.emptyDirSync(distPath);
fs.copy(`${srcPath}/assets`, `${distPath}/assets`);

console.log('Supported file extensions:');
console.log(
  styles.textFgGreen,
  `${config.build.supportedContentExtensionsPattern}`
);

const files = glob.sync(
  `**/*.@(${config.build.supportedContentExtensionsPattern})`,
  { cwd: `${srcPath}/${srcPathSites}` }
);

const navArr = [];
let actualDir = '';

// Iterate through all files to generate Navigation links
files.forEach(file => {
  let navItem = { root: null, items: [ { dir: null, name: null } ] };
  // let navChild = { dir: null, name: null };

  const fileInfoNav = path.parse(file);

  navItem.dir = fileInfoNav.dir;
  navItem.name = fileInfoNav.name;

  if (fileInfoNav.dir !== '') {
    if (fileInfoNav.dir !== '' && actualDir !== fileInfoNav.dir) {
      navItem.root = actualDir = fileInfoNav.dir; // actual folder is root
      // navChild = { dir: fileInfoNav.dir, name: fileInfoNav.name }; // assign first child ...
      navItem.items.push({ dir: fileInfoNav.dir, name: fileInfoNav.name }); // ... and push it to root
    } else {
      navItem.root = actualDir;
      // navChild = { dir: fileInfoNav.dir, name: fileInfoNav.name };
      navItem.items.push({ dir: fileInfoNav.dir, name: fileInfoNav.name });
    }
    navArr.push(navItem);
    actualDir = fileInfoNav.dir;
  }
});
console.log('_: ', navArr);

console.log('\n', styles.styleReset);
console.log('Detected files:\n', files);

files.forEach(file => {
  // Prepare destination folder
  const fileInfo = path.parse(file);

  const fileCopyPath = path.join(distPath, fileInfo.dir);
  fs.mkdirpSync(fileCopyPath);

  // Read content
  const pageFile = fs.readFileSync(
    `${srcPath}/${srcPathSites}/${file}`,
    'utf-8'
  );
  const pageData = frontMatter(pageFile);
  const actualDate = moment().format('LLL');
  const templateConfig = Object.assign(
    {},
    { lastupdate: actualDate, navData: navArr },
    config,
    {
      page: pageData.attributes
    }
  );

  let pageContent;

  switch (fileInfo.ext) {
    case '.md':
      pageContent = converter.makeHtml(pageData.body);
      break;
    case '.ejs':
      pageContent = ejs.render(pageData.body, templateConfig, {
        filename: `${srcPath}${srcPathSites}/${file}`
      });
      break;
    default:
      pageContent = pageData.body;
  }

  // Assign layouts
  const layout = pageData.attributes.layout || 'default';
  const layoutFileName = `${srcPath}/${srcPathLayouts}/${layout}.ejs`;
  const layoutData = fs.readFileSync(layoutFileName, 'utf-8');

  const finalPage = ejs.render(
    layoutData,
    Object.assign({}, templateConfig, {
      body: pageContent,
      filename: layoutFileName
    })
  );

  // Save file with name of folder and file name
  fs.writeFileSync(
    `${distPath}/${fileInfo.dir}/${fileInfo.name}.html`,
    finalPage,
    'utf-8'
  );
});

console.log('\n', styles.textFgMagenta);
console.log('//-----------------------------------------------------');
console.log('\t Finished static site generation');
console.log('//-----------------------------------------------------');
