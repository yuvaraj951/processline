'use strict';

System.register(['angular', 'lodash', 'app/core/utils/kbn', 'jquery'], function (_export, _context) {
  "use strict";

  var angular, _, kbn, $;

  return {
    setters: [function (_angular) {
      angular = _angular.default;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_appCoreUtilsKbn) {
      kbn = _appCoreUtilsKbn.default;
    }, function (_jquery) {
      $ = _jquery.default;
    }],
    execute: function () {
      //import './dragging_service'

      angular.module('grafana.directives').directive('processLine', function () {

        return {
          restrict: 'E',
          templateUrl: 'public/plugins/grafana-processline-panel/partials/node.html',
          //replace: true,
          scope: {
            chart: "=chart",
            color: "=color"
          }

        };
      });
    }
  };
});
//# sourceMappingURL=mydirective.js.map
