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

      angular.module('grafana.directives').directive('nodeMenu', function ($compile, linkSrv) {
        var linkTemplate = 'hello';
        /*  '<span class="panel-title drag-handle pointer">' +
            '<span class="panel-title-text drag-handle">{{ctrl.panel.chartDataModel.nodes.name | interpolateTemplateVars:this}}</span>' +
            '<span class="panel-links-btn"><i class="fa fa-external-link"></i></span>' +
            '<span class="panel-time-info" ng-show="ctrl.timeInfo"><i class="fa fa-clock-o"></i> {{ctrl.timeInfo}}</span>' +
          '</span>';
        function createExternalLinkMenu(ctrl) {
        var template = '<div class="node-menu small">';
        template += '<div class="node-menu-row">';
         if (ctrl.panel.links) {
          _.each(ctrl.panel.links, function(link) {
            var info = linkSrv.getPanelLinkAnchorInfo(link, ctrl.panel.scopedVars);
            template += '<a class="panel-menu-link" href="' + info.href + '" target="' + info.target + '">' + info.title + '</a>';
          });
        }
        return template;
        }
        */
        function createMenuTemplate(ctrl) {
          var template = '<div class="panel-menu small" style="margin-top: -130px;">';

          if (ctrl.dashboard.meta.canEdit) {
            template += '<div class="panel-menu-inner">';
            template += '<div class="panel-menu-row">';
            if (!ctrl.dashboard.meta.fullscreen) {
              //template += '<a class="panel-menu-icon pull-left" ng-click="ctrl.updateColumnSpan(-1)"><i class="fa fa-minus"></i></a>';
              //template += '<a class="panel-menu-icon pull-left" ng-click="ctrl.updateColumnSpan(1)"><i class="fa fa-plus"></i></a>';
            }
            template += '<a class="panel-menu-icon pull-right" ng-click="ctrl.removeNode(ctrl.panel.chartDataModel.nodes)"><i class="fa fa-trash"></i></a>';
            template += '<div class="clearfix"></div>';
            template += '</div>';
          }

          template += '<div class="panel-menu-row">';
          template += '<a class="panel-menu-link" gf-dropdown="extendedMenu"><i class="fa fa-bars"></i></a>';

          _.each(ctrl.getMenu(), function (item) {
            // skip edit actions if not editor
            if (item.role === 'Editor' && !ctrl.dashboard.meta.canEdit) {
              return;
            }

            template += '<a class="panel-menu-link" ';
            if (item.click) {
              template += ' ng-click="' + item.click + '"';
            }
            if (item.href) {
              template += ' href="' + item.href + '"';
            }
            template += '>';
            template += item.text + '</a>';
          });

          template += '</div>';
          template += '</div>';
          template += '</div>';
          return template;
        }

        function getExtendedMenu(ctrl) {
          return ctrl.getExtendedMenu();
        }

        return {
          restrict: 'A',
          link: function link($scope, elem) {
            var $link = $(linkTemplate);
            var $panelLinksBtn = $link.find(".panel-links-btn");
            var $panelContainer = elem.parents(".panel-container");
            var menuScope = null;
            var ctrl = $scope.ctrl;
            var timeout = null;
            var $menu = null;
            var teather;

            elem.append($link);

            $scope.$watchCollection('ctrl.panel.links', function (newValue) {
              var showIcon = (newValue ? newValue.length > 0 : false) && ctrl.panel.title !== '';
              $panelLinksBtn.toggle(showIcon);
            });

            function dismiss(time, force) {
              clearTimeout(timeout);
              timeout = null;

              if (time) {
                timeout = setTimeout(dismiss, time);
                return;
              }

              // if hovering or draging pospone close
              if (force !== true) {
                if ($menu.is(':hover') || $scope.ctrl.dashboard.$$panelDragging) {
                  dismiss(2200);
                  return;
                }
              }

              if (menuScope) {
                teather.destroy();
                $menu.unbind();
                $menu.remove();
                menuScope.$destroy();
                menuScope = null;
                $menu = null;
                $panelContainer.removeClass('panel-highlight');
              }
            }

            var showMenu = function showMenu(e) {
              // if menu item is clicked and menu was just removed from dom ignore this event
              if (!$.contains(document, e.target)) {
                return;
              }

              if ($menu) {
                dismiss();
                return;
              }

              var menuTemplate;
              if ($(e.target).hasClass('fa-external-link')) {
                menuTemplate = createExternalLinkMenu(ctrl);
              } else {
                menuTemplate = createMenuTemplate(ctrl);
              }

              $menu = $(menuTemplate);
              $menu.mouseleave(function () {
                dismiss(1000);
              });

              menuScope = $scope.$new();
              menuScope.extendedMenu = getExtendedMenu(ctrl);
              menuScope.dismiss = function () {
                dismiss(null, true);
              };

              $(".panel-container").removeClass('panel-highlight');
              $panelContainer.toggleClass('panel-highlight');

              $('.panel-menu').remove();

              elem.append($menu);

              $scope.$apply(function () {
                $compile($menu.contents())(menuScope);

                teather = new Tether({
                  element: $menu,
                  target: $panelContainer,
                  attachment: 'bottom center',
                  targetAttachment: 'top center',
                  constraints: [{
                    to: 'window',
                    attachment: 'together',
                    pin: true
                  }]
                });
              });

              dismiss(2200);
            };

            elem.click(showMenu);
            $compile(elem.contents())($scope);
          }
        };
      });
    }
  };
});
//# sourceMappingURL=node-directive.js.map
