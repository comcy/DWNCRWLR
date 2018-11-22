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
  NavigationCollection
} from './helpers';

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

  // private navigationItem: NavigationItem;
  private navigation: NavigationCollection<NavigationItem>;
  // private menu: Navigation[] = [];

  constructor() {}

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
    fs.copy(`${this.srcPath}/assets`, `${this.distPath}/assets`);
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
    let dirFlag = '';

    this.files.forEach(file => {
      const fileInfoNav = path.parse(file);
      const fileContent = readFileContents(
        `${this.srcPath}/${this.srcPathSites}`,
        file
      );
      const fileMetadata = frontMatter(fileContent);

      if (fileInfoNav.dir !== '' && dirFlag !== fileInfoNav.dir) {
        dirFlag = fileInfoNav.dir;
        this.navigation = new NavigationCollection<NavigationItem>();

        this.navigation.Add(
          dirFlag,
          new NavigationItem(
            fileInfoNav.name,
            fileInfoNav.dir,
            fileMetadata.attributes['displayName']
          )
        );
        // this.navigation = new Navigation(
        //   fileInfoNav.dir,
        //   new Array(
        //     new NavigationItem(
        //       fileInfoNav.name,
        //       fileInfoNav.dir,
        //       fileMetadata.attributes['displayName']
        //     )
        //   )
        // );
        dirFlag = fileInfoNav.dir;
      } else {
        // this.navigation.setItem(
        //   new NavigationItem(
        //     fileInfoNav.name,
        //     fileInfoNav.dir,
        //     fileMetadata.attributes['displayName']
        //   )
        // );
        // this.navigation.items.concat(
        //   new NavigationItem(
        //     fileInfoNav.name,
        //     fileInfoNav.dir,
        //     fileMetadata.attributes['displayName']
        //   )
        // );
      }
      // this.menu.push(this.navigation);
    });

    // console.log('####################################################');
    // // console.log('> ', this.menu);

    // // TODO: remove later on
    // // Navigation structure:
    // this.menu.forEach(navigation => {
    //   console.log('_: ', this.menu);
    //   navigation.items.forEach(element => {
    //     element.name + element.link;
    //     // console.log('childs >>>: ', element.name + ' - ' + element.link);
    //   });
    // });
    // console.log('####################################################');
  }

  private generateAllFiles() {
    this.files.forEach(file => {
      const fileInfo = path.parse(file);
      // console.log(fileInfo);
      const fileCopyPath = path.join(this.distPath, fileInfo.dir);
      fs.mkdirpSync(fileCopyPath);

      // Read content
      // const pageFile = fs.readFileSync(
      //   `${this.srcPath}/${this.srcPathSites}/${file}`,
      //   'utf-8'
      // );

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
          navData: this.navigation
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

  /**
   *
   * @param path
   * @param fileName
   * @param encoding
   */
  // private readFileContents(path: string, fileName: string, encoding: string = 'utf-8'): string {
  //   return fs.readFileSync(`${path}/${fileName}`, encoding);
  // }
}

let main = new Main();
main.init();
