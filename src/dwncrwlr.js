#!/usr/bin/env node
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
var Main = (function () {
    function Main() {
    }
    Main.prototype.init = function () {
        this.config = require('../dwncrwlr.config.json');
        if (this.checkConfig(this.config)) {
            this.srcPathSites = this.config.build.srcPathSites;
            this.srcPathLayouts = this.config.build.srcPathLayouts;
            if (this.config.build.srcPathLayouts === '' || this.config.build.srcPathLayouts === null || this.config.build.srcPathLayouts === undefined) {
                this.srcPathLayouts = this.config.build.srcPathLayouts;
            }
            else {
                this.srcPathLayouts = './views/layouts';
            }
            this.srcAssets = this.config.build.srcAssets;
            this.distPath = this.config.build.distPath;
            this.supportedExtensions = this.config.build.supportedContentExtensionsPattern;
        }
        else {
            console.log(helpers_1.consoleStyle.textFgRed, 'NO CONFIGURATION WAS FOUND!!!');
        }
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
    Main.prototype.checkConfig = function (config) {
        if (config === null || config === undefined || config === '')
            return false;
        else
            return true;
    };
    Main.prototype.cleanUpDist = function () {
        fs.emptyDirSync("" + this.distPath);
    };
    Main.prototype.copyAssets = function () {
        fs.copy("" + this.srcAssets, this.distPath + "/" + this.srcAssets);
    };
    Main.prototype.loadAllFiles = function () {
        console.log('Supported file extensions:');
        console.log(helpers_1.consoleStyle.textFgGreen, "" + this.supportedExtensions);
        this.files = glob.sync("**/*.@(" + this.supportedExtensions + ")", {
            cwd: "" + this.srcPathSites
        });
        console.log('\n', helpers_1.consoleStyle.styleReset);
        console.log('Detected files:\n', this.files);
    };
    Main.prototype.createNavigation = function () {
        var _this = this;
        this.navigation = new helpers_1.ArrayListMultimap();
        this.files.forEach(function (file) {
            var fileInfoNav = path.parse(file);
            var fileContent = helpers_1.readFileContents("" + _this.srcPathSites, file);
            var fileMetadata = frontMatter(fileContent);
            if (fileInfoNav.dir !== '') {
                _this.navigation.put(fileInfoNav.dir, new models_1.NavigationItem(fileInfoNav.name, fileInfoNav.dir, fileMetadata.attributes['displayName']));
            }
        });
        console.log('####################################################');
        this.navigation.keys().forEach(function (key) {
            console.log('Key: ', key);
            console.log('Count: ' + _this.navigation.valueCount(key));
            _this.navigation.get(key).forEach(function (val) {
                console.log('Value: ', val);
            });
        });
        console.log('####################################################');
    };
    Main.prototype.generateAllFiles = function () {
        var _this = this;
        this.files.forEach(function (file) {
            var fileInfo = path.parse(file);
            var fileCopyPath = path.join(_this.distPath, fileInfo.dir);
            fs.mkdirpSync(fileCopyPath);
            var pageFile = helpers_1.readFileContents("" + _this.srcPathSites, file);
            var pageData = frontMatter(pageFile);
            var actualDate = moment().format('LLL');
            var templateConfig = Object.assign({}, {
                lastupdate: actualDate,
                navigation: _this.navigation
            }, _this.config, {
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
                        filename: _this.srcPathSites + "/" + file
                    });
                    break;
                default:
                    pageContent = pageData.body;
            }
            var layout = pageData.attributes['layout'] || 'default';
            var layoutFileName = _this.srcPathLayouts + "/" + layout + ".ejs";
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