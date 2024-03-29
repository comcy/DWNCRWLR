#!/usr/bin/env node
import * as ejs from 'ejs';
// <<<<<<< HEAD
// import * as frontMatter from 'front-matter';
import * as fs from 'fs-extra';
import * as glob from 'glob';
// import * as moment from 'moment';
import * as path from 'path';
import * as showdown from 'showdown';

import fm from 'front-matter';
import moment from 'moment';

import { Argument, Cli } from './cli';
import { FrontmatterAttributes } from './enums';
import { NavigationItem } from './models';
// >>>>>>> feature/re-implementation
import {
  ArrayListMultimap,
  consoleStyle,
  getAssetsPath,
  getViewsPath,
  readFileContents,
  isEmptyNullUndefined
} from './helpers';
// import { NavigationItem } from './models';

export class Dwncrwlr {

  // Variabel declaration defined in dwncrwlr.config.json
// <<<<<<< HEAD
  private config;
  private srcPath;
  private srcPathSites;
  private distPath;
  private srcCustomPathLayouts;
  private srcCustomAssets;
  private supportedExtensions;
// =======
//   private srcPath = config.build.srcPath;
//   private srcPathSites = config.build.srcPathSites;
//   private srcPathLayouts = config.build.srcPathLayouts;
//   private srcAssets = config.build.srcAssets;
//   private distPath = config.build.distPath;
//   private supportedExtensions = config.build.supportedContentExtensionsPattern;
// >>>>>>> feature/re-implementation

  // Build declarations
  private files;

  // private navigationItem: NavigationItem;
  private navigation: ArrayListMultimap<string, NavigationItem>;

  constructor(configPath: string) {

    // TODO: refactoring file input
    this.config = require(`${configPath}`);
    this.srcPath = this.config.build.srcPath;
    this.srcPathSites = this.config.build.srcPathSites;
    this.distPath = this.config.build.distPath;
    this.srcCustomPathLayouts = this.config.build.customPathLayouts;
    this.srcCustomAssets = this.config.build.customAssets;
    this.supportedExtensions = this.config.build.supportedContentExtensionsPattern;
  }

  get execBaseHref(): string {
    return __dirname;
  }

  public init() {
    // tslint:disable-next-line:no-console
    console.log(consoleStyle.textFgRed, consoleStyle.asciiLogo);
    // tslint:disable-next-line:no-console
    console.log('\n', consoleStyle.textFgMagenta);
    // tslint:disable-next-line:no-console
    console.log('//-----------------------------------------------------');
    // tslint:disable-next-line:no-console
    console.log('\t Starting static site generation');
    // tslint:disable-next-line:no-console
    console.log('//-----------------------------------------------------');
    // tslint:disable-next-line:no-console
    console.log('\n', consoleStyle.styleReset);

    this.cleanUpDist();
    this.copyAssets();
    this.loadAllFiles();
    this.createNavigation();
    this.generateAllFiles();

    // tslint:disable-next-line:no-console
    console.log('\n', consoleStyle.textFgMagenta);
    // tslint:disable-next-line:no-console
    console.log('//-----------------------------------------------------');
    // tslint:disable-next-line:no-console
    console.log('\t Finished static site generation');
    // tslint:disable-next-line:no-console
    console.log('//-----------------------------------------------------');
  }

  private cleanUpDist() {
    fs.emptyDirSync(`${this.distPath}`);
  }

  private copyAssets() {
    let assetsPath: string[] = [];
    if (!isEmptyNullUndefined(this.srcCustomAssets)) {
      assetsPath = getAssetsPath(this.srcPath, this.srcCustomAssets);
      fs.copy(`${assetsPath[0]}${assetsPath[1]}`, `${this.distPath}/${assetsPath[1]}`);
    } else {
      fs.copy(`${assetsPath[0]}${assetsPath[1]}`, `${this.distPath}/${assetsPath[1]}`);
    }

  }

  private loadAllFiles() {
    // tslint:disable-next-line:no-console
    console.log('Supported file extensions:');
    // tslint:disable-next-line:no-console
    console.log(consoleStyle.textFgGreen, `${this.supportedExtensions}`);

    this.files = glob.sync(`**/*.@(${this.supportedExtensions})`, {
      cwd: `${this.srcPath}/${this.srcPathSites}`
    });

    // tslint:disable-next-line:no-console
    console.log('\n', consoleStyle.styleReset);
    // tslint:disable-next-line:no-console
    console.log('Detected files:\n', this.files);
  }

  private createNavigation() {
    this.navigation = new ArrayListMultimap<string, NavigationItem>();
    this.files.forEach(file => {
      const fileInfoNav = path.parse(file);
      const fileContent = readFileContents(
        `${this.srcPath}/${this.srcPathSites}`,
        file
      );

      const fileMetadata = fm(fileContent);

      if (fileInfoNav.dir !== '') {
        this.navigation.put(
          fileInfoNav.dir,
          new NavigationItem(
            fileInfoNav.name,
            fileInfoNav.dir,
            fileMetadata.attributes[FrontmatterAttributes.DisplayName]
          )
        );
      }
    });

    // tslint:disable-next-line:no-console
    console.log('####################################################');
    this.navigation.keys().forEach(key => {
      // tslint:disable-next-line:no-console
      console.log('Key: ', key);
      // tslint:disable-next-line:no-console
      console.log('Count: ' + this.navigation.valueCount(key));
      this.navigation.get(key).forEach(val => {
        // tslint:disable-next-line:no-console
        console.log('Value: ', val);
      });
    });
    // tslint:disable-next-line:no-console
    console.log('####################################################');
  }

  private generateAllFiles() {
    this.files.forEach(file => {
      const fileInfo = path.parse(file);
      const fileCopyPath = path.join(this.distPath, fileInfo.dir);
      fs.mkdirpSync(fileCopyPath);

      const pageFile = readFileContents(
        `${this.srcPath}/${this.srcPathSites}`,
        file
      );

      const pageData = fm(pageFile);
      const actualDate = moment().format('LLL');
      const templateConfig = Object.assign(
        {},
        {
          lastupdate: actualDate,
          navigation: this.navigation
        },
        this.config,
        {
          page: pageData.attributes
        }
      );

      let pageContent;

      switch (fileInfo.ext) {
        case '.md':
          const converter = new showdown.Converter();
          pageContent = converter.makeHtml(pageData.body);
          break;
        case '.ejs':
          pageContent = ejs.render(pageData.body, templateConfig, {
            filename: `${this.srcPath}${this.srcPathSites}/${file}`
          });
          break;
        default:
          pageContent = pageData.body;
      }

      // Assign layouts

      // TODO: get dist layouts


      const layout = pageData.attributes[FrontmatterAttributes.Layout] || 'default';

      console.log('layout ::: ', layout);

      const viewsPath: string[] = getViewsPath(__dirname, this.srcCustomPathLayouts);

      console.log('viewsPath ::: ', viewsPath);

      const layoutFileName = `${viewsPath[0]}${viewsPath[1]}/${layout}.ejs`;

      console.log('name ::: ', __dirname + layoutFileName);

      // TODO: src path is detected -> path is not correct
      const layoutData = fs.readFileSync(__dirname + layoutFileName, 'utf-8');

      console.log('==> ', layoutData)

      const finalPage = ejs.render(
        layoutData,
        Object.assign({}, templateConfig, {
          body: pageContent,
          filename: layoutFileName
        })
      );

      console.log('==> ', finalPage)

      // Save file with name of folder and file name
      fs.writeFileSync(
        `${this.distPath}/${fileInfo.dir}/${fileInfo.name}.html`,
        finalPage,
        'utf-8'
      );
    });
  }
}

// const pathName = __dirname;
// console.log(pathName);

// const inputParams = process.argv.slice(2);
// const cli = new Cli(pathName, inputParams);
// const argument = new Argument(cli.getCliArgs());

// var argv = require('minimist')(process.argv.slice(2));

// const input: string = argv.i; // -i: input parameter 
// console.log('input: ', input);

const baseHref = process.cwd();

console.log('exec folder:::', baseHref);

const dwncrwlr = new Dwncrwlr(baseHref + '/dwncrwlr.config.json');
dwncrwlr.init();
