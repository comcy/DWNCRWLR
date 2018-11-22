"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var path = require("path");
var ejs = require("ejs");
var glob = require("glob");
var showdown = require("showdown");
var frontMatter = require("front-matter");
var moment = require("moment");
var models_1 = require("./models");
var helpers_1 = require("./helpers");
var config = require('../dwncrwlr.config.json');
var Main = (function () {
    function Main() {
        this.srcPath = config.build.srcPath;
        this.srcPathSites = config.build.srcPathSites;
        this.srcPathLayouts = config.build.srcPathLayouts;
        this.distPath = config.build.distPath;
        this.supportedExtensions = config.build.supportedContentExtensionsPattern;
    }
    Main.prototype.init = function () {
        console.log(helpers_1.consoleStyle.textFgRed, helpers_1.consoleStyle.asciiLogo);
        console.log('\n', helpers_1.consoleStyle.textFgMagenta);
        console.log('//-----------------------------------------------------');
        console.log('\t Starting static site generation');
        console.log('//-----------------------------------------------------');
        console.log('\n', helpers_1.consoleStyle.styleReset);
        this.cleanUpDist();
        this.copyAssets();
        this.loadAllFiles();
        this.createNavigation();
        this.generateAllFiles();
        console.log('\n', helpers_1.consoleStyle.textFgMagenta);
        console.log('//-----------------------------------------------------');
        console.log('\t Finished static site generation');
        console.log('//-----------------------------------------------------');
    };
    Main.prototype.cleanUpDist = function () {
        fs.emptyDirSync("" + this.distPath);
    };
    Main.prototype.copyAssets = function () {
        fs.copy(this.srcPath + "/assets", this.distPath + "/assets");
    };
    Main.prototype.loadAllFiles = function () {
        console.log('Supported file extensions:');
        console.log(helpers_1.consoleStyle.textFgGreen, "" + this.supportedExtensions);
        this.files = glob.sync("**/*.@(" + this.supportedExtensions + ")", {
            cwd: this.srcPath + "/" + this.srcPathSites
        });
        console.log('\n', helpers_1.consoleStyle.styleReset);
        console.log('Detected files:\n', this.files);
    };
    Main.prototype.createNavigation = function () {
        var _this = this;
        var dirFlag = '';
        this.files.forEach(function (file) {
            var fileInfoNav = path.parse(file);
            var fileContent = helpers_1.readFileContents(_this.srcPath + "/" + _this.srcPathSites, file);
            var fileMetadata = frontMatter(fileContent);
            if (fileInfoNav.dir !== '' && dirFlag !== fileInfoNav.dir) {
                dirFlag = fileInfoNav.dir;
                _this.navigation = new helpers_1.NavigationCollection();
                _this.navigation.Add(dirFlag, new models_1.NavigationItem(fileInfoNav.name, fileInfoNav.dir, fileMetadata.attributes['displayName']));
                dirFlag = fileInfoNav.dir;
            }
            else {
            }
        });
    };
    Main.prototype.generateAllFiles = function () {
        var _this = this;
        this.files.forEach(function (file) {
            var fileInfo = path.parse(file);
            var fileCopyPath = path.join(_this.distPath, fileInfo.dir);
            fs.mkdirpSync(fileCopyPath);
            var pageFile = helpers_1.readFileContents(_this.srcPath + "/" + _this.srcPathSites, file);
            var pageData = frontMatter(pageFile);
            var actualDate = moment().format('LLL');
            var templateConfig = Object.assign({}, {
                lastupdate: actualDate,
                navData: _this.navigation
            }, config, {
                page: pageData.attributes
            });
            var pageContent;
            switch (fileInfo.ext) {
                case '.md':
                    var converter = new showdown.Converter();
                    pageContent = converter.makeHtml(pageData.body);
                    break;
                case '.ejs':
                    pageContent = ejs.render(pageData.body, templateConfig, {
                        filename: "" + _this.srcPath + _this.srcPathSites + "/" + file
                    });
                    break;
                default:
                    pageContent = pageData.body;
            }
            var layout = pageData.attributes['layout'] || 'default';
            var layoutFileName = _this.srcPath + "/" + _this.srcPathLayouts + "/" + layout + ".ejs";
            var layoutData = fs.readFileSync(layoutFileName, 'utf-8');
            var finalPage = ejs.render(layoutData, Object.assign({}, templateConfig, {
                body: pageContent,
                filename: layoutFileName
            }));
            fs.writeFileSync(_this.distPath + "/" + fileInfo.dir + "/" + fileInfo.name + ".html", finalPage, 'utf-8');
        });
    };
    return Main;
}());
exports.Main = Main;
var main = new Main();
main.init();
//# sourceMappingURL=dwncrwlr.js.map