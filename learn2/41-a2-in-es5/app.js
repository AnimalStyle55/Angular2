(function (ng) {
  "use strict";

  var AppComponent = ng.core.Component({
    selector: "my-app",
    template: "<h1>An Angular 2 App</h1>"
  }).Class({
    constructor: function () {
      //
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    ng.platform.browser.bootstrap(AppComponent);
  });

})(window.ng);
