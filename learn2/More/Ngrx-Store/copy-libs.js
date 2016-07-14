var Promise = require("bluebird");
var copyfiles = Promise.promisify(require('copyfiles'));

// A real application would probably have a Gulp or Grunt or
// similar setup, and do this work there.

Promise.all([
  copyfiles([
    "node_modules/@ngrx/store/dist/*",
    "www/lib/@ngrx"
  ], true),
  copyfiles([
    "node_modules/angular2/bundles/angular2-polyfills.js",
    "node_modules/systemjs/dist/system-polyfills.js",
    "node_modules/systemjs/dist/system.js",
    "node_modules/rxjs/bundles/Rx.js",
    "node_modules/angular2/bundles/angular2.js",
    "node_modules/angular2/bundles/http.js",
    "node_modules/angular2/bundles/router.js",
    "node_modules/angular2/es6/prod/src/testing/shims_for_IE.js",
    "www/lib",
  ], true)]
).then(success => {
  console.log("Libraries copied successfully");
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
