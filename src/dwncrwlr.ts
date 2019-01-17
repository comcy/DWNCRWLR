#!/usr/bin/env node
import * as ejs from 'ejs';
import * as frontMatter from 'front-matter';
import * as fs from 'fs-extra';
import * as glob from 'glob';
import * as moment from 'moment';
import * as path from 'path';
import * as showdown from 'showdown';

import { Argument, Cli } from './cli';
import { FrontmatterAttributes } from './enums';
import {
  ArrayListMultimap,
  consoleStyle,
  getAssetsPath,
  getViewsPath,
  readFileContents
} from './helpers';
import { NavigationItem } from './models';

export class Dwncrwlr {

  // Variabel declaration defined in dwncrwlr.config.json
  private config;
  private srcPath;
  private srcPathSites;
  private distPath;
  private srcCustomPathLayouts;
  private srcCustomAssets;
  private supportedExtensions;

  // Build declarations
  private files;

  // private navigationItem: NavigationItem;
  private navigation: ArrayListMultimap<string, NavigationItem>;

  constructor(configPath: string) {

    // TODO: refactoring file input
    this.config = require(`../${configPath}`);
    this.srcPath = this.config.build.srcPath;
    this.srcPathSites = this.config.build.srcPathSites;
    this.distPath = this.config.build.distPath;
    this.srcCustomPathLayouts = this.config.build.customPathLayouts;
    this.srcCustomAssets = this.config.build.customAssets;
    this.supportedExtensions = this.config.build.supportedContentExtensionsPattern;
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
    const assetsPath: string[] = getAssetsPath(this.srcPath, this.srcCustomAssets);
    fs.copy(`${assetsPath[0]}${assetsPath[1]}`, `${this.distPath}/${assetsPath[1]}`);
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
    this.files.forEach((file) => {
      const fileInfoNav = path.parse(file);
      const fileContent = readFileContents(
        `${this.srcPath}/${this.srcPathSites}`,
        file
      );
      const fileMetadata = frontMatter(fileContent);
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

      const pageData = frontMatter(pageFile);
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
      const layout = pageData.attributes[FrontmatterAttributes.Layout] || 'default';
      const viewsPath: string[] = getViewsPath(this.srcPath, this.srcCustomPathLayouts);
      const layoutFileName = `${viewsPath[0]}/${viewsPath[1]}/${layout}.ejs`;
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
        `${this.distPath}/${fileInfo.dir}/${fileInfo.name}.html`,
        finalPage,
        'utf-8'
      );
    });
  }
}

const cli = new Cli();
const argument = new Argument(cli.getCliArgs());

const dwncrwlr = new Dwncrwlr(argument.getInput());
dwncrwlr.init();
