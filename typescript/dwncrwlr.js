"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var path = require("path");
var ejs = require("ejs");
var glob = require("glob");
var showdown = require("showdown");
var frontMatter = require("front-matter");
var moment = require("moment");
var console_style_1 = require("./console-style");
var config = require('../dwncrwlr.config.json');
var Main = (function () {
    function Main() {
        this.srcPath = config.build.srcPath;
        this.srcPathSites = config.build.srcPathSites;
        this.srcPathLayouts = config.build.srcPathLayouts;
        this.distPath = config.build.distPath;
        this.supportedExtensions = config.build.supportedContentExtensionsPattern;
        this.navigations = [];
    }
    Main.prototype.init = function () {
        console.log(console_style_1.style.textFgRed, console_style_1.style.asciiLogo);
        console.log('\n', console_style_1.style.textFgMagenta);
        console.log('//-----------------------------------------------------');
        console.log('\t Starting static site generation');
        console.log('//-----------------------------------------------------');
        console.log('\n', console_style_1.style.styleReset);
        this.cleanUpDist();
        this.copyAssets();
        this.loadAllFiles();
        this.createNavigation();
        this.generateAllFiles();
        console.log('\n', console_style_1.style.textFgMagenta);
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
        console.log(console_style_1.style.textFgGreen, "" + this.supportedExtensions);
        this.files = glob.sync("**/*.@(" + this.supportedExtensions + ")", {
            cwd: this.srcPath + "/" + this.srcPathSites
        });
        console.log('\n', console_style_1.style.styleReset);
        console.log('Detected files:\n', this.files);
    };
    Main.prototype.createNavigation = function () {
        var _this = this;
        var actualDir = '';
        this.files.forEach(function (file) {
            var fileInfoNav = path.parse(file);
            if (fileInfoNav.dir !== '' && actualDir !== fileInfoNav.dir) {
                _this.navigation = {
                    parent: actualDir = fileInfoNav.dir,
                    items: []
                };
                _this.navigationItem = {
                    name: fileInfoNav.name,
                    link: fileInfoNav.dir
                };
                _this.navigation.items.push(_this.navigationItem);
            }
            else {
                _this.navigation.parent = actualDir;
                _this.navigationItem = {
                    name: fileInfoNav.name,
                    link: fileInfoNav.dir
                };
                _this.navigation.items.push(_this.navigationItem);
            }
            actualDir = fileInfoNav.dir;
            _this.navigations.push(_this.navigation);
        });
        this.navigations.forEach(function (navigation) {
            console.log('_: ', navigation);
            navigation.items.forEach(function (element) {
                element.name + element.link;
            });
        });
    };
    Main.prototype.generateAllFiles = function () {
        var _this = this;
        this.files.forEach(function (file) {
            var fileInfo = path.parse(file);
            console.log(fileInfo);
            var fileCopyPath = path.join(_this.distPath, fileInfo.dir);
            fs.mkdirpSync(fileCopyPath);
            var pageFile = fs.readFileSync(_this.srcPath + "/" + _this.srcPathSites + "/" + file, 'utf-8');
            var pageData = frontMatter(pageFile);
            var actualDate = moment().format('LLL');
            var templateConfig = Object.assign({}, {
                lastupdate: actualDate,
                navData: _this.navigations
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