import * as fs from 'fs-extra';
import * as path from 'path';
import * as ejs from 'ejs';
import * as glob from 'glob';
import * as showdown from 'showdown';
import * as frontMatter from 'front-matter';
import * as moment from 'moment';
import { Navigation } from './navigation';
import { NavigationItem } from './navigation-item';

import { style } from './console-style';

const config = require('../dwncrwlr.config.json');

export class Main {
  // Variabel declaration defined in dwncrwlr.config.json
  private srcPath = config.build.srcPath;
  private srcPathSites = config.build.srcPathSites;
  private srcPathLayouts = config.build.srcPathLayouts;
  private distPath = config.build.distPath;

  private supportedExtensions = config.build.supportedContentExtensionsPattern;

  // Build declarations
  private files;

  private navigationItem: NavigationItem;
  private navigation: Navigation;
  private navigations: Navigation[] = [];

  constructor() { }

  public init() {
    console.log(style.textFgRed, style.asciiLogo);
    console.log('\n', style.textFgMagenta);
    console.log('//-----------------------------------------------------');
    console.log('\t Starting static site generation');
    console.log('//-----------------------------------------------------');
    console.log('\n', style.styleReset);

    this.cleanUpDist();
    this.copyAssets();
    this.loadAllFiles();
    this.createNavigation();
    this.generateAllFiles();

    console.log('\n', style.textFgMagenta);
    console.log('//-----------------------------------------------------');
    console.log('\t Finished static site generation');
    console.log('//-----------------------------------------------------');
  }

  private cleanUpDist() {
    fs.emptyDirSync(`${this.distPath}`);
  }

  private copyAssets() {
    fs.copy(`${this.srcPath}/assets`, `${this.distPath}/assets`);
  }

  private loadAllFiles() {
    console.log('Supported file extensions:');
    console.log(style.textFgGreen, `${this.supportedExtensions}`);

    this.files = glob.sync(`**/*.@(${this.supportedExtensions})`, {
      cwd: `${this.srcPath}/${this.srcPathSites}`
    });

    console.log('\n', style.styleReset);
    console.log('Detected files:\n', this.files);
  }

  private createNavigation() {
    let ifCount: number = 0;
    let elseCount: number = 0;
    let actualDirectory = '';
    let actualNavigation: Navigation;

    this.files.forEach(file => {
      const fileInfoNav = path.parse(file);
      //     // if (fileInfoNav.dir !== '' && actualDirectory === fileInfoNav.dir) {
      //       // this.navigation = {
      //       //   parent: actualDirectory = fileInfoNav.dir,
      //       //   items: []
      //       // };
      //       // this.navigationItem = {
      //       //   name: fileInfoNav.name,
      //       //   link: fileInfoNav.dir
      //       // };
      //       // this.navigation.items = [];
      //       // this.navigation.items.push(this.navigationItem);
      //     // }

      // check if root and actual folder is not already assigned = init
      if (fileInfoNav.dir !== '' && actualDirectory !== fileInfoNav.dir) {
        this.navigation = new Navigation(fileInfoNav.dir);
        this.navigation.setItem(new NavigationItem(fileInfoNav.name, fileInfoNav.dir)); // ... and push it to root

        actualDirectory = fileInfoNav.dir;
        actualNavigation = this.navigation;

        // console.log('if-count: ' + ifCount++);
        // console.log(this.navigation);
        // console.log(this.navigationItem);
      }
      else { // act == dir
        this.navigationItem = new NavigationItem(fileInfoNav.name, fileInfoNav.dir);
        actualNavigation.setItem(this.navigationItem);//new NavigationItem(fileInfoNav.name, fileInfoNav.dir)); // ... and push it to root
        // console.log('else-count: ' + elseCount++);
        // console.log(actualNavigation);
        // console.log(this.navigationItem);
      }

      this.navigations.push(actualNavigation);
      this.navigation = null
      actualDirectory = fileInfoNav.dir;
    });

    // Navigation structure:
    this.navigations.forEach(navigation => {
      console.log('_: ', navigation);
      navigation.items.forEach(element => {
        element.name + element.link;
        // console.log('childs >>>: ', element.name + ' - ' + element.link);
      });
    });
  }

  private generateAllFiles() {
    this.files.forEach(file => {
      const fileInfo = path.parse(file);
      // console.log(fileInfo);
      const fileCopyPath = path.join(this.distPath, fileInfo.dir);
      fs.mkdirpSync(fileCopyPath);

      // Read content
      const pageFile = fs.readFileSync(
        `${this.srcPath}/${this.srcPathSites}/${file}`,
        'utf-8'
      );
      const pageData = frontMatter(pageFile);
      const actualDate = moment().format('LLL');
      const templateConfig = Object.assign(
        {},
        {
          lastupdate: actualDate,
          navData: this.navigations
        },
        config,
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
      const layoutFileName = `${this.srcPath}/${
        this.srcPathLayouts
        }/${layout}.ejs`;
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
