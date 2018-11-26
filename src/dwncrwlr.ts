#!/usr/bin/env node

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
  ArrayListMultimap
} from './helpers';

// const config = require('../dwncrwlr.config.json');

export class Main {

  // Variabel declaration defined in dwncrwlr.config.json
  private config;
  private srcPath;
  private srcPathSites;
  private srcPathLayouts;
  private srcAssets;
  private distPath;
  private supportedExtensions;

  // Build declarations
  private files;

  // private navigationItem: NavigationItem;
  private navigation: ArrayListMultimap<string, NavigationItem>;

  constructor() {}

  public init() {
    
    // Setup
    this.config = require('../dwncrwlr.config.json');

    if (this.checkConfig(this.config)) { // Check if config file exist
      // this.srcPath = this.config.build.srcPath;
      this.srcPathSites = this.config.build.srcPathSites;
      this.srcPathLayouts = this.config.build.srcPathLayouts;
      if (this.config.build.srcPathLayouts === '' || this.config.build.srcPathLayouts === null || this.config.build.srcPathLayouts === undefined) { // Check if custom layouts are provided
        this.srcPathLayouts = this.config.build.srcPathLayouts;
      } else {
        this.srcPathLayouts = './views/layouts'
      }
      this.srcAssets = this.config.build.srcAssets;
      this.distPath = this.config.build.distPath;
      this.supportedExtensions = this.config.build.supportedContentExtensionsPattern;
    } else {
      console.log(consoleStyle.textFgRed, 'NO CONFIGURATION WAS FOUND!!!');
    }    
    
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

  private checkConfig(config: any): boolean {
    if (config === null || config === undefined || config === '') return false;
    else return true;
  }

  private cleanUpDist() {
    fs.emptyDirSync(`${this.distPath}`);
  }

  private copyAssets() {
    fs.copy(`${this.srcAssets}`, `${this.distPath}/${this.srcAssets}`);
  }

  private loadAllFiles() {
    console.log('Supported file extensions:');
    console.log(consoleStyle.textFgGreen, `${this.supportedExtensions}`);

    this.files = glob.sync(`**/*.@(${this.supportedExtensions})`, {
      cwd: `${this.srcPathSites}`
    });

    console.log('\n', consoleStyle.styleReset);
    console.log('Detected files:\n', this.files);
  }

  private createNavigation() {
    this.navigation = new ArrayListMultimap<string, NavigationItem>();
    this.files.forEach(file => {
      const fileInfoNav = path.parse(file);
      const fileContent = readFileContents(
        `${this.srcPathSites}`,
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
        `${this.srcPathSites}`,
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
            filename: `${this.srcPathSites}/${file}`
          });
          break;
        default:
          pageContent = pageData.body;
      }

      // Assign layouts
      const layout = pageData.attributes['layout'] || 'default';
      const layoutFileName = `${this.srcPathLayouts}/${layout}.ejs`;

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

let main = new Main();
main.init();
