"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var path = require("path");
var ejs = require("ejs");
var glob = require("glob");
var showdown = require("showdown");
var frontMatter = require("front-matter");
var moment = require("moment");
var navigation_1 = require("./navigation");
var navigation_item_1 = require("./navigation-item");
var console_style_1 = require("./console-style");
var config = require('../dwncrwlr.config.json');
var Main = (function () {
    function Main() {
        this.srcPath = config.build.srcPath;
        this.srcPathSites = config.build.srcPathSites;
        this.srcPathLayouts = config.build.srcPathLayouts;
        this.distPath = config.build.distPath;
        this.supportedExtensions = config.build.supportedContentExtensionsPattern;
        this.menu = [];
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
        var ifCount = 0;
        var elseCount = 0;
        var dirFlag = '';
        var actualNavigation;
        this.files.forEach(function (file) {
            var fileInfoNav = path.parse(file);
            if (fileInfoNav.dir !== '' && dirFlag !== fileInfoNav.dir) {
                _this.navigation = new navigation_1.Navigation(fileInfoNav.dir, new Array(new navigation_item_1.NavigationItem(fileInfoNav.name, fileInfoNav.dir)));
                dirFlag = fileInfoNav.dir;
                console.log('if-count: ' + ifCount++);
                console.log(_this.navigation);
            }
            else {
                _this.navigation.items.push(new navigation_item_1.NavigationItem(fileInfoNav.name, fileInfoNav.dir));
                console.log('else-count: ' + elseCount++);
                console.log(_this.navigation);
            }
        });
        this.menu.push(this.navigation);
        console.log('####################################################');
        console.log('> ', this.menu);
        console.log('####################################################');
    };
    Main.prototype.generateAllFiles = function () {
        var _this = this;
        this.files.forEach(function (file) {
            var fileInfo = path.parse(file);
            var fileCopyPath = path.join(_this.distPath, fileInfo.dir);
            fs.mkdirpSync(fileCopyPath);
            var pageFile = fs.readFileSync(_this.srcPath + "/" + _this.srcPathSites + "/" + file, 'utf-8');
            var pageData = frontMatter(pageFile);
            var actualDate = moment().format('LLL');
            var templateConfig = Object.assign({}, {
                lastupdate: actualDate,
                navData: _this.menu
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