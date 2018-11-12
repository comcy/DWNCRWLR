const fs = require('fs-extra');
const config = require('../dwncrwlr.config.json');

const srcPath = config.build.srcPath;
const distPath = config.build.distPath;

// Empty dist folder
fs.emptyDirSync(distPath);

// Copy required assets to dist folder
fs.copy(`${srcPath}/assets`, `${distPath}/assets`);