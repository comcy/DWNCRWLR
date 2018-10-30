const fs = require('fs');
let resizable = fs.readFileSync('./src/package.json').toString();
fs.writeFileSync('./dist/package.json', resizable);