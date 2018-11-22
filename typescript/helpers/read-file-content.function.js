"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
exports.readFileContents = function (path, fileName, encoding) {
    if (encoding === void 0) { encoding = 'utf-8'; }
    return fs.readFileSync(path + "/" + fileName, encoding);
};
//# sourceMappingURL=read-file-content.function.js.map