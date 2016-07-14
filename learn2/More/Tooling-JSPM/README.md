# A2 Tooling with JSPM

Install Node and NPM as usual.

```
npm install -g jspm
```

Start a project:

```
npm init
npm install --save jspm
npm install --save live-server

npm install --save angular2
```

angular2 is only to get a raw polyfill file, and support TS.
A2 itself will be loaded via JSPM.

```
jspm init
// Tell it baseUrl = www
// Tell it transpiler = TypeScript

jspm install angular2 zone.js reflect-metadata typescript

```

Add node_modules and jspm_packages to .gitignore.

Set up your scripts in package.json:

```
  "scripts": {
    "postinstall": "jspm install",
    "start": "live-server www",
    "prod": "jspm bundle-sfx app www-dist/dist.js --minify && live-server www-dist"
  },
```

The "prod" above is very much WIP. The Angular team is still working
on their bundling story.


In the past we have found the following must be added to config.js to
make it possible to use angular/MODULENAME. This will likely stop being
needed at some point.

```
    "angular2/*": "jspm_packages/npm/angular2@2.0.0-alpha.45/*"
```

Make an index.html with something like this:

```
    <script src="jspm_packages/system.js"></script>
    <script src="config.js"></script>
    <script>
      System.import('app').catch(console.log.bind(console));
    </script>
```

To make VSCode and/or Typescript happy, create tsconfig.json:

```
{
    "compilerOptions": {
        "module": "commonjs",
        "noImplicitAny": true,
        "removeComments": true,
        "preserveConstEnums": true,
        "sourceMap": true,
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,
        "target": "ES5"
    }
}
```

Make a www/app directory. Assuming you named it app, add something like this to config.js:

```
  packages: {
    "app": {
      "main": "app",
      "defaultExtension": "ts"
    }
  },
```

Start writing Angular 2 code in www/app/app.ts.

You need to get Zone and shims on the page. Load these either in app.ts,
or manually using script elements. These go *before* importing A2.

```
import 'zone.js';
import 'reflect-metadata';
```

Leave off ".ts" on module names when importing.


Because this is JSPM, no special file serving as needed. A local or global install of any common server (such as live server via NPM) works fine.

```
live-server
```





jspm install angular-core=npm:@angular/core
jspm install angular-compiler=npm:@angular/compiler
jspm install angular-common=npm:@angular/common
jspm install angular-platform-browser=npm:@angular/platform-browser
jspm install angular-platform-browser-dynamic=npm:@angular/platform-browser-dynamic


jspm bundle "@angular/core" + "@angular/common" + "@angular/http" + "@angular/compiler" + "@angular/platform-browser-dynamic" + ts + rxjs --inject


