# DWNCRWLR

[![Build Status](https://comcy.visualstudio.com/Tools/_apis/build/status/%5BCI%5D%20DWNCRWLR_master?branchName=master)](https://comcy.visualstudio.com/Tools/_build/latest?definitionId=2?branchName=master)
[![npm version](https://badge.fury.io/js/dwncrwlr.svg)](https://badge.fury.io/js/dwncrwlr)

`DWNCRWLR` is a static site generator. 

This repository  represents a ready-for-use sample project for usage of the generator itself. 

This repository also provides a `npm` package to integrate the generator to any project structure you want.


**Content**

- [DWNCRWLR](#dwncrwlr)
  - [Installation](#installation)
    - [Clone](#clone)
    - [Setup](#setup)
  - [Usage](#usage)
    - [Customization](#customization)
  - [Documentation](#documentation)
  - [Tests](#tests)
  - [FAQ / Troubleshooting](#faq--troubleshooting)
  - [License](#license)
  - [Further readings](#further-readings)
    - [Tests](#tests-1)

---


## Installation

The repository mainly provides two different approaches for using it:

1. 'Clone and own' the repsoitory and make small and simple configurations to use it or just extend its functionality. If you want to use this approach then follow the instrcutions under the next [Section: Clone](#clone). 

2. Use the `npm` package within your custom project and provide a configuration. Then follow [Section: Setup](#setup).




### Clone

If you just want to use the project structure provided within this repsoitory you can simply use it by follow the steps below:

1. Clone the repository

    ```bash
    git clone 
    ```
2. Edit `dwncrwlr.config.json` for custom setup

    ```bash
    site: {

    },
    build: {

    }
    ```
    -  for any detailed information read [Section: Setup](#setup)

TODO: write about cloning repo, edit config and use structure to generate a site.

### Setup

TODO: Write install and edit config.

`views`

`sites`

`assets`


## Usage

TODO: Describe assets


### Customization

View: `partials`

View: `layouts`


## Documentation


## Tests

Tests can be run by using 'npm test'. 

Unit Test are supported by Jasmine.

Spec reporters:

- Junit XML based file output
- Console output

## FAQ / Troubleshooting

- **How do I do *specifically* so and so?**
    - No problem! Just do this.


## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2018 © <a href="http://comcy.github.io" target="_blank">comcy</a>.


## Further readings

### Tests

https://stackoverflow.com/questions/30863565/unit-testing-using-jasmine-and-typescript

https://stackoverflow.com/questions/67299/is-unit-testing-worth-the-effort?rq=1

http://bisaga.com/blog/programming/testing-typescript-node-app-with-jasmine/

https://www.npmjs.com/package/jasmine-trx-reporter
