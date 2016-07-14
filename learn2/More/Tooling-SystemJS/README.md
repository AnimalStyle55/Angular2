# A2 Tooling with SystemJS and TSC

## Important

This example is shown with a Angular 2 beta. As of June 2016,
the Angular 2 release candidates have not included system bundles,
although something similar is possible with UMD bundles.

We have preserved this is an example of a type of setup that is possible,
depending on what ends up being shipped with Angular itself.

To see something similar, look at the "quick start" provided on
http://angular.io

## Description

This is a minimal and fast development tool set,
using few packages and few moving parts.
Typescript is compiled with TSC.
Because TypeScript's tsc does most of the work,
t's worth reading the documentation:

https://github.com/Microsoft/TypeScript/wiki/Compiler-Options

Limitations of this approach:

* No way to bundle HTML, so I just used inline templates.
  External HTML files work, and it will go away when the
  Angular 2 template precompiler is ready.
* For simplicity, this gathers only the development libraries;
  it could be enhanced to create an additional set of output for deployment,
  using pre-minified libraries and adding Uglify or Closure to minify the
  compiled TypeScript.

## To implement this from scratch:

* npm init -y
* npm install --save angular2@2.0.0-beta.11 es6-promise es6-shim reflect-metadata@0.1.2 rxjs zone.js@0.6.4 systemjs copyfiles live-server rimraf typescript
* npm install -g typescript live-server
* modify package.json, add the appropriate scripts
  *  "clean": "npm install rimraf && rimraf typings www/lib/*.js www/bundle.* node_modules",
  *  "postinstall": "node copy-libs.js && tsc",
  *  "watch": "tsc --watch",
  *  "start": "live-server www --wait=300"
* Add a tsconfig.json file at the root of the project directory (see example file for contents)
* Update index.html to use the bundle produced by tsc
