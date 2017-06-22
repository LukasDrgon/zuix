 [![Build Status](https://travis-ci.org/genielabs/zuix.svg?branch=master)](https://travis-ci.org/genielabs/zuix)
 [![npm dist](https://badge.fury.io/js/zuix-dist.svg)](https://badge.fury.io/js/zuix-dist)

## ZUIX.js - Content and Component Manager

ZUIX is a JavaScript library for creating component-based sites and web apps.


### Getting Started

Install and include `zuix.min.js` library using one of the following methods.

###### Local copy

Download and copy the `.js` file to your project folder and include it in your HTML page:

```html
<script src="js/zuix.min.js"></script>
```

[Download **ZUIX v0.4.9-23**](https://genielabs.github.io/zuix/js/zuix.min.js)
*~11 kB (gzipped)*

###### Hosted

Link the `.js` file as an external resource from *GitHub* site:

```html
<script src="https://genielabs.github.io/zuix/js/zuix.min.js"></script>
```

###### NPM

Install from *NPM*

    npm install zuix-dist --save

Include the library from *node_modules* folder in your HTML project files:

```html
    <script src="node_modules/zuix-dist/js/zuix.min.js"></script>
```

###### Bower

Install from *Bower*

    bower install zuix-dist --save

Include the library from *bower_components* folder in your HTML project files:

```html
    <script src="bower_components/zuix-dist/js/zuix.min.js"></script>
```


### Examples

The following online examples can also be downloaded as a **.zip** file
containing everything is needed to get you started.

- [**TodoMVC**](https://genielabs.github.io/zuix-todomvc)
*the classic To-Do MVC application implemented as a loadable component*
- [**Hacker News Web**](https://genielabs.github.io/zuix-hackernews)
*example of using* **list_view** *component with progressive/lazy loading*


### Contributing

Clone [**ZUIX repository**](https://github.com/genielabs/zuix) or install
`zuix` development package from *NPM*

    npm install zuix

Start local web server (default on port 8080)

    npm run start

###### Build

Build source and create minified version in `./dist/js` folder:

    gulp

or

    npm run build

this will also generate JSON formatted JSDoc API files in *_docs* folder.

To submit a new release

    npm run release <newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease

if passing *CI* tests this will also publish *npm packages* and update *ZUIX web site*
files in *gh-pages* branch.
The script run on the *CI* server side is

    npm run deploy


### Documentation and API

[ZUIX Home](https://genielabs.github.io/zuix/)

