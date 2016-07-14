var copyfiles = require('copyfiles');

// A real application would probably have a Gulp or Grunt or
// similar setup, and do this there.

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
  ],
  true,
  function (err) {
    if (err) {
      console.error(err);
      process.exit(1);
    } else {
      console.log("Copy successful");
      process.exit(0);
    }
  });
