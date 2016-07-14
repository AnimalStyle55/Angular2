# Compiling Angular 2 applications, development and production

Angular-CLI

* Best choice to start, because...
* It is endorsed by the Angular team.

SystemJS + TSC:

* Least tools.
* Easiest to run.
* Scales up to large projects, because it runs the least code.
* Might be closed to official angular-cli.
* Still not caught up with (for example) Java IDEs.

SystemJS:

* Compile TypeScript in the browser during development.
* Possible to get up and running with only static files.
* Must bundle for production, too many small files!
* Can be quite slow in development, as projects grow.

WebPack / Browserify / Require:

* Long, proven history.
* Highly numerous plugins and addons.
* Can be quite slow in development.
* Tendency to end up with a long, complex config file.

Rollup

* http://rollupjs.org/
* Coming soon.
* Should optimize smaller.

