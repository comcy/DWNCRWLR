#!/usr/bin/env node
import { Argument } from "./cli/arguments";

import * as fs from 'fs-extra';
import * as path from 'path';
import * as ejs from 'ejs';
import * as glob from 'glob';
import * as showdown from 'showdown';
import * as frontMatter from 'front-matter';
import * as moment from 'moment';
import { NavigationItem } from './models';
import {
  consoleStyle,
  readFileContents,
  ArrayListMultimap,
  getAssetsPath,
  getViewsPath
} from './helpers';
import { Cli } from './cli/cli';

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
    console.log(consoleStyle.textFgRed, consoleStyle.asciiLogo);
    console.log('\n', consoleStyle.textFgMagenta);
    console.log('//-----------------------------------------------------');
    console.log('\t Starting static site generation');
    console.log('//-----------------------------------------------------');
    console.log('\n', consoleStyle.styleReset);

    this.cleanUpDist();
    this.copyAssets();
    this.loadAllFiles();
    this.createNavigation();
    this.generateAllFiles();

    console.log('\n', consoleStyle.textFgMagenta);
    console.log('//-----------------------------------------------------');
    console.log('\t Finished static site generation');
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
    console.log('Supported file extensions:');
    console.log(consoleStyle.textFgGreen, `${this.supportedExtensions}`);

    this.files = glob.sync(`**/*.@(${this.supportedExtensions})`, {
      cwd: `${this.srcPath}/${this.srcPathSites}`
    });

    console.log('\n', consoleStyle.styleReset);
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
      const fileMetadata = frontMatter(fileContent);
      if (fileInfoNav.dir !== '') {
        this.navigation.put(
          fileInfoNav.dir,
          new NavigationItem(
            fileInfoNav.name,
            fileInfoNav.dir,
            fileMetadata.attributes['displayName']
          )
        );
      }
    });

    // DEBUG OUTPUT FOR FILE HIERACHY
    console.log('####################################################');
    this.navigation.keys().forEach(key => {
      console.log('Key: ', key);
      console.log('Count: ' + this.navigation.valueCount(key))
      this.navigation.get(key).forEach(val => {
        console.log('Value: ', val);
      })
    });
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
      const layout = pageData.attributes['layout'] || 'default';
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

let cli = new Cli();
let argument = new Argument(cli.getCliArgs());

let dwncrwlr = new Dwncrwlr(argument.getInput());
dwncrwlr.init();
