import angular from 'angular';
import _ from  'lodash';
import kbn from 'app/core/utils/kbn';
import $ from 'jquery';
//import './dragging_service'

angular.module('grafana.directives').directive('processLine', function(){


return {
         restrict:'E',
        templateUrl:'public/plugins/grafana-processline-panel/partials/node.html',
        //replace: true,
          	scope: {
          		chart: "=chart",
          		color:"=color"
          	},

         	//
          	// Controller for the flowchart directive.
          	// Having a separate controller is better for unit testing, otherwise
          	// it is painful to unit test a directive without instantiating the DOM
          	// (which is possible, just not ideal).
          	//
          	//controller: 'FlowChartController',
}

});

