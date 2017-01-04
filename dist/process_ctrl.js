'use strict';

System.register(['angular', 'lodash', 'jquery', 'app/core/profiler', 'app/core/core', 'app/core/utils/kbn', 'app/core/config', 'app/core/time_series2', 'app/plugins/sdk', 'app/features/panel/query_ctrl', './flowchart/ChartViewModel', 'moment', './mydirective', './drag_drop', './node-directive'], function (_export, _context) {
  "use strict";

  var angular, _, $, profiler, Emitter, kbn, config, TimeSeries, PanelCtrl, MetricsPanelCtrl, alertTab, QueryCtrl, ChartViewModel, moment, _createClass, unitFormats, panelDefaults, ProcessLineCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_angular) {
      angular = _angular.default;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_jquery) {
      $ = _jquery.default;
    }, function (_appCoreProfiler) {
      profiler = _appCoreProfiler.profiler;
    }, function (_appCoreCore) {
      Emitter = _appCoreCore.Emitter;
    }, function (_appCoreUtilsKbn) {
      kbn = _appCoreUtilsKbn.default;
    }, function (_appCoreConfig) {
      config = _appCoreConfig.default;
    }, function (_appCoreTime_series) {
      TimeSeries = _appCoreTime_series.default;
    }, function (_appPluginsSdk) {
      PanelCtrl = _appPluginsSdk.PanelCtrl;
      MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
      alertTab = _appPluginsSdk.alertTab;
    }, function (_appFeaturesPanelQuery_ctrl) {
      QueryCtrl = _appFeaturesPanelQuery_ctrl.QueryCtrl;
    }, function (_flowchartChartViewModel) {
      ChartViewModel = _flowchartChartViewModel.ChartViewModel;
    }, function (_moment) {
      moment = _moment.default;
    }, function (_mydirective) {}, function (_drag_drop) {}, function (_nodeDirective) {}],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      unitFormats = [];
      panelDefaults = {

        valueNameOptions: ['min', 'max', 'avg', 'current', 'total', 'name'],
        valueName: 'avg',
        decimals: 3,
        contentHtml: '',
        format: 'none',
        mode: "markdown",
        content: "# title",
        thresholds: '0,10',
        bgcolor: 'white',
        colors: ['rgba(50, 172, 45, 1)', 'rgba(241, 255, 0, 1)', 'rgba(245, 54, 54, 1)'],
        Name: 'Node',
        chartDataModel: {
          nodes: []

        }
      };

      _export('ProcessLineCtrl', ProcessLineCtrl = function (_MetricsPanelCtrl) {
        _inherits(ProcessLineCtrl, _MetricsPanelCtrl);

        function ProcessLineCtrl($scope, $injector, $window, templateSrv, $sce) {
          _classCallCheck(this, ProcessLineCtrl);

          var _this2 = _possibleConstructorReturn(this, (ProcessLineCtrl.__proto__ || Object.getPrototypeOf(ProcessLineCtrl)).call(this, $scope, $injector, $window));

          _this2.$scope = $scope;
          _this2.templateSrv = templateSrv;
          _this2.$sce = $sce;
          _.defaults(_this2.panel, panelDefaults);
          _this2.CompanyName = "Process Line Montoring";

          _this2.events.on('init-edit-mode', _this2.onInitEditMode.bind(_this2));
          _this2.events.on('refresh', _this2.onRender.bind(_this2));
          _this2.events.on('render', _this2.onRender.bind(_this2));
          _this2.publishAppEvent('panel-initialized', { scope: _this2.$scope });
          //this.events.on('init-edit-mode', this.updateClock.bind(this));
          _this2.chartModel = new ChartViewModel(_this2.panel.chartDataModel);
          _this2.getUnits();
          // this.update();
          _this2.document = document;

          return _this2;
        }

        _createClass(ProcessLineCtrl, [{
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            this.addEditorTab('Options', 'public/plugins/grafana-processline-panel/partials/Options.html', 4);
            this.addEditorTab('Process Options', 'public/plugins/grafana-processline-panel/partials/editor.html', 3);
            this.addEditorTab('Help', 'public/plugins/grafana-processline-panel/partials/help.html', 5);
            this.events.on('data-received', this.onDataReceived.bind(this));
            this.events.on('data-error', this.onDataError.bind(this));
            this.panel.unitFormats = kbn.getUnitFormats();
          }
        }, {
          key: 'publishAppEvent',
          value: function publishAppEvent(evtName, evt) {
            this.$scope.$root.appEvent(evtName, evt);
          }
        }, {
          key: 'setUnitFormat',
          value: function setUnitFormat(subItem) {
            this.panel.format = subItem.value;
            this.render();
          }
        }, {
          key: 'getUnits',
          value: function getUnits() {

            this.unitFormats = kbn.getUnitFormats();

            /*
                    for(var i=0; i<=this.panel.chartDataModel.nodes.length; i++){
                     	for(var e of this.panel.chartDataModel.nodes) {
                             var threshold=e.thresholds;
                             var values=threshold.split(",");
                              var lowerValue=parseInt(values[0]);
                                                 console.log(lowerValue);
                                                 var higherValue=parseInt(values[1]);
                                                   console.log(higherValue);
            
                                                   if(lowerValue<0|| higherValue>0){
                                                   this.src="public/plugins/grafana-processline-panel/img/worng.png";
                                                   }
                                                   else{
                                                   this.src="public/plugins/grafana-processline-panel/img/tick.png";
                                                   }//console.log(values);
                         }
                     }
            */
            //this.src="public/plugins/grafana-processline-panel/img/tick.png";
            //this.width="130px"
            //var e1=document.getElementById("shape");
            //this.align = e1.getAttribute("nodeX");
          }
        }, {
          key: 'onRender',
          value: function onRender() {
            if (this.panel.mode === 'html') {
              this.updateContent(this.panel.content);
            } else if (this.panel.mode === 'text') {
              this.renderText(this.panel.content);
            }
            this.renderingCompleted();
          }
        }, {
          key: 'renderText',
          value: function renderText(content) {
            content = content.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/\n/g, '<br/>');
            this.updateContent(content);
          }
        }, {
          key: 'renderMarkdown',
          value: function renderMarkdown(content) {
            var _this = this;
            if (!this.remarkable) {
              return System.import('remarkable').then(function (Remarkable) {
                _this.remarkable = new Remarkable();
                _this.$scope.$apply(function () {
                  _this.updateContent(_this.remarkable.render(content));
                });
              });
            }
            this.updateContent(this.remarkable.render(content));
          }
        }, {
          key: 'updateContent',
          value: function updateContent(html) {
            try {

              this.panel.contentHtml = this.$sce.trustAsHtml(this.templateSrv.replace(html, this.panel.scopedVars));
            } catch (e) {
              console.log('Text panel error: ', e);
              this.content = this.$sce.trustAsHtml(html);
            }
          }
        }, {
          key: 'addNewNode',
          value: function addNewNode(data) {

            var nodeName = prompt("Enter a node name:", "New node");
            if (!nodeName) {
              return;
            }

            //


            // Template for a new node.
            //
            var newNodeDataModel = {
              name: nodeName,
              id: this.panel.nextNodeID++,
              x: 0,
              y: 0,
              width: '80px',
              thresholds: '0,10,20,30,40',
              stages: 'init,start,run,process,end',
              colors: ['rgba(50, 172, 45, 1)', 'rgba(241, 255, 0, 1)', 'rgba(245, 54, 54, 1)', 'rgba(245, 54, 54, 1)', 'rgba(245, 54, 54, 1)'],
              url: '',
              Data: []

            };

            //newNodeDataModel.Data.push(data)
            this.chartModel.addNode(newNodeDataModel);
          }
        }, {
          key: 'getDecimalsForValue',
          value: function getDecimalsForValue(value) {
            if (_.isNumber(this.panel.decimals)) {
              return { decimals: this.panel.decimals, scaledDecimals: null };
            }

            var delta = value / 2;
            var dec = -Math.floor(Math.log(delta) / Math.LN10);

            var magn = Math.pow(10, -dec),
                norm = delta / magn,
                // norm is between 1.0 and 10.0
            size;

            if (norm < 1.5) {
              size = 1;
            } else if (norm < 3) {
              size = 2;
              // special case for 2.5, requires an extra decimal
              if (norm > 2.25) {
                size = 2.5;
                ++dec;
              }
            } else if (norm < 7.5) {
              size = 5;
            } else {
              size = 10;
            }

            size *= magn;

            // reduce starting decimals if not needed
            if (Math.floor(value) === value) {
              dec = 0;
            }

            var result = {};
            result.decimals = Math.max(0, dec);
            result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;

            return result;
          }
        }, {
          key: 'onDataError',
          value: function onDataError(err) {
            this.onDataReceived([]);
          }
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(dataList) {
            this.series = dataList.map(this.seriesHandler.bind(this));
            var data = {};
            this.setValues(data);
            this.data = data;
            console.log(this.data);
            this.updateNode(this.data);
            this.render(this.data);
          }
        }, {
          key: 'seriesHandler',
          value: function seriesHandler(seriesData) {

            var series = new TimeSeries({
              datapoints: seriesData.datapoints,
              alias: seriesData.target,
              unit: false
            });
            series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);

            return series;
          }
        }, {
          key: 'setValues',
          value: function setValues(data) {
            if (this.series && this.series.length > 0) {
              for (var i = 0; i < this.series.length; i++) {
                var seriesItem = this.series[i];
                console.debug('setting values for series');
                console.debug(seriesItem);
                data[seriesItem.alias] = this.applyOverrides(seriesItem.alias);
                var lastPoint = _.last(seriesItem.datapoints);
                var lastValue = _.isArray(lastPoint) ? lastPoint[0] : null;
                console.log(lastPoint);
                console.log(lastValue);
                if (this.panel.valueName === 'name') {
                  data[seriesItem.alias].value = 0;
                  data[seriesItem.alias].valueRounded = 0;
                  data[seriesItem.alias].valueFormated = seriesItem.alias;
                } else if (_.isString(lastValue)) {
                  data[seriesItem.alias].value = 0;
                  data[seriesItem.alias].valueFormated = _.escape(lastValue);
                  data[seriesItem.alias].valueRounded = 0;
                } else {
                  //data[seriesItem.alias].value = lastValue;
                  data[seriesItem.alias].Name = seriesItem.alias;
                  //data[seriesItem.alias].flotpairs = seriesItem.flotpairs;
                  data[seriesItem.alias].value = seriesItem.stats[this.panel.valueName];
                  data.flotpairs = seriesItem.flotpairs;
                  var decimalInfo = this.getDecimalsForValue(data[seriesItem.alias].value);
                  var formatFunc = kbn.valueFormats[this.panel.format];
                  data[seriesItem.alias].valueFormated = formatFunc(data[seriesItem.alias].value, decimalInfo.decimals, decimalInfo.scaledDecimals);
                  data[seriesItem.alias].valueRounded = kbn.roundValue(data[seriesItem.alias].value, decimalInfo.decimals);
                }
              }
            }
          }
        }, {
          key: 'applyOverrides',
          value: function applyOverrides(seriesItemAlias) {
            var seriesItem = {},
                colorData = {},
                overrides = {};
            console.info('applying overrides for seriesItem');
            console.debug(seriesItemAlias);
            console.debug(this.panel.chartDataModel.nodes);
            for (var i = 0; i <= this.panel.chartDataModel.nodes.length; i++) {
              console.debug('comparing:');
              console.debug(this.panel.chartDataModel.nodes[i]);
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = this.panel.chartDataModel.nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var e = _step.value;

                  if (e.name == this.metricsNodeName) {
                    overrides = seriesItemAlias;
                  }
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }
            }

            seriesItem.Name = overrides || this.panel.Name;

            return seriesItem;
          }
        }, {
          key: 'updateNode',
          value: function updateNode(nodeData) {
            var dataKeys = Object.keys(nodeData);
            console.log(dataKeys[0]);
            var dataValues = Object.values(nodeData);
            console.log(dataValues[0]);
            console.log(dataValues);

            var SingleProcess = this.chartModel.data.nodes;

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = SingleProcess[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var EachProcess = _step2.value;


                var ProcessName = EachProcess.name;
                for (var i = 0; i <= dataValues.length; i++) {
                  if (ProcessName == dataKeys[i]) {
                    var dataValue = dataValues[i];
                    console.log(dataValues);
                    EachProcess.Data.pop();
                    EachProcess.Data.push(dataValue);
                  }
                }
              }

              /*
              if(singleProcess.name==this.metricsNodeName){
                    singleProcess.Data.pop();
                    singleProcess.Data.push(nodeData);
              }*/
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }
          }
        }, {
          key: 'render',
          value: function render(data) {

            this.updateNode(data);
            // this.chartModel=new ChartViewModel(this.panel.chartDataModel);
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = this.panel.chartDataModel.nodes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var e = _step3.value;

                var threshold = e.thresholds;
                var values = threshold.split(",");
                console.log(values);

                var stages = e.stages;
                var StagesArray = stages.split(",");
                console.log(StagesArray);
                var Value1 = parseInt(values[0]);
                console.log(Value1);
                var Value2 = parseInt(values[1]);
                console.log(Value2);
                var Value3 = parseInt(values[2]);
                console.log(Value3);
                var Value4 = parseInt(values[3]);
                console.log(Value4);
                var color = e.colors;
                console.log(color);
                console.log(color[0]);
                var data;
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                  for (var _iterator4 = e.Data[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var val = _step4.value;

                    data = val.valueFormated;
                  }
                } catch (err) {
                  _didIteratorError4 = true;
                  _iteratorError4 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                      _iterator4.return();
                    }
                  } finally {
                    if (_didIteratorError4) {
                      throw _iteratorError4;
                    }
                  }
                }

                console.log(data);

                if (data < Value1) {
                  e.stroke = color[0];
                  e.status = StagesArray[0];
                  console.log(e);
                } else if (data > Value1 && data < Value2) {
                  e.stroke = color[1];
                  e.status = StagesArray[1];
                  console.log(e);
                } else if (data > Value2 && data < Value3) {
                  e.stroke = color[2];
                  e.status = StagesArray[2];
                  console.log(e);
                } else if (data > Value3 && data < Value4) {

                  e.stroke = color[3];
                  e.status = StagesArray[3];
                  console.log(e);
                } else if (data > Value4) {
                  e.stroke = color[4];
                  e.status = StagesArray[4];
                  console.log(e);
                }
                //this.src=src;
                //this.bordershadow=bordershadow;

              }

              //this.width="130px"

            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }
          }
        }, {
          key: 'UpdateNodeMetrics',
          value: function UpdateNodeMetrics(nodename) {

            this.metricsNodeName = nodename;
            var nodeDetails = this.panel.chartDataModel.nodes;
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
              for (var _iterator5 = nodeDetails[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var singleProcess = _step5.value;

                if (singleProcess.name == this.metricsNodeName) {
                  this.process = singleProcess;
                  console.log(this.process);
                }
              }
            } catch (err) {
              _didIteratorError5 = true;
              _iteratorError5 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                  _iterator5.return();
                }
              } finally {
                if (_didIteratorError5) {
                  throw _iteratorError5;
                }
              }
            }
          }
        }, {
          key: 'DeleteNode',
          value: function DeleteNode(node) {
            var nodeDelete = this.panel.chartDataModel.nodes;
            var index = nodeDelete.findIndex(function (o) {
              return o.name === node;
              console.log(index);
            });
            nodeDelete.splice(index, 1);
          }
        }, {
          key: 'updateWidth',
          value: function updateWidth(nodeName, nodeWidth) {
            var nodeDetails = this.panel.chartDataModel.nodes;
            if (singleProcess.name == nodeName) {
              var _iteratorNormalCompletion6 = true;
              var _didIteratorError6 = false;
              var _iteratorError6 = undefined;

              try {
                for (var _iterator6 = nodeDetails.Data[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                  var singleProcess = _step6.value;

                  singleProcess.width = nodeWidth;
                }
              } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion6 && _iterator6.return) {
                    _iterator6.return();
                  }
                } finally {
                  if (_didIteratorError6) {
                    throw _iteratorError6;
                  }
                }
              }
            }
          }
        }, {
          key: 'changeBgColor',
          value: function changeBgColor(color) {
            this.panel.bgcolor = color;
          }
        }, {
          key: 'updateThresholds',
          value: function updateThresholds(threshold) {
            console.log(threshold);
            var thresholdValue = document.getElementById("thresold").value;;
            console.log(thresholdValue);

            var nodeDetails = this.panel.chartDataModel.nodes;

            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
              for (var _iterator7 = nodeDetails[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var singleProcess = _step7.value;

                if (singleProcess.name == threshold) {

                  singleProcess.thresholds = thresholdValue;

                  console.log(this.panel.chartDataModel.nodes);
                }
              }
            } catch (err) {
              _didIteratorError7 = true;
              _iteratorError7 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                  _iterator7.return();
                }
              } finally {
                if (_didIteratorError7) {
                  throw _iteratorError7;
                }
              }
            }
          }
        }, {
          key: 'updateStatus',
          value: function updateStatus(processName) {
            console.log(processName);
            var statusName = document.getElementById("stages").value;;
            console.log(statusName);

            var nodeDetails = this.panel.chartDataModel.nodes;

            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
              for (var _iterator8 = nodeDetails[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                var singleProcess = _step8.value;

                if (singleProcess.name == processName) {

                  singleProcess.stages = statusName;

                  alert("successfully updated");
                }
              }
            } catch (err) {
              _didIteratorError8 = true;
              _iteratorError8 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion8 && _iterator8.return) {
                  _iterator8.return();
                }
              } finally {
                if (_didIteratorError8) {
                  throw _iteratorError8;
                }
              }
            }
          }
        }, {
          key: 'changeColor',
          value: function changeColor(colorIndex, color, nodeName) {

            var nodeDetails = this.panel.chartDataModel.nodes;

            var _iteratorNormalCompletion9 = true;
            var _didIteratorError9 = false;
            var _iteratorError9 = undefined;

            try {
              for (var _iterator9 = nodeDetails[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                var singleProcess = _step9.value;

                if (singleProcess.name == nodeName) {

                  singleProcess.colors[colorIndex] = color;

                  console.log(singleProcess);
                }
              }
            } catch (err) {
              _didIteratorError9 = true;
              _iteratorError9 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion9 && _iterator9.return) {
                  _iterator9.return();
                }
              } finally {
                if (_didIteratorError9) {
                  throw _iteratorError9;
                }
              }
            }
          }
        }, {
          key: 'removeColor',
          value: function removeColor(colorIndex, nodeName) {

            var nodeDetails = this.panel.chartDataModel.nodes;

            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
              for (var _iterator10 = nodeDetails[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                var singleProcess = _step10.value;

                if (singleProcess.name == nodeName) {

                  singleProcess.colors.splice(colorIndex, 1);
                }
              }
            } catch (err) {
              _didIteratorError10 = true;
              _iteratorError10 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion10 && _iterator10.return) {
                  _iterator10.return();
                }
              } finally {
                if (_didIteratorError10) {
                  throw _iteratorError10;
                }
              }
            }
          }
        }, {
          key: 'addColor',
          value: function addColor(nodeName) {

            var nodeDetails = this.panel.chartDataModel.nodes;

            var _iteratorNormalCompletion11 = true;
            var _didIteratorError11 = false;
            var _iteratorError11 = undefined;

            try {
              for (var _iterator11 = nodeDetails[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                var singleProcess = _step11.value;


                if (singleProcess.name == nodeName) {

                  singleProcess.colors.push('rgba(255, 255, 255, 1)');

                  console.log(singleProcess.colors);
                }
              }
            } catch (err) {
              _didIteratorError11 = true;
              _iteratorError11 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion11 && _iterator11.return) {
                  _iterator11.return();
                }
              } finally {
                if (_didIteratorError11) {
                  throw _iteratorError11;
                }
              }
            }
          }
        }, {
          key: 'sharePanelDefalut',
          value: function sharePanelDefalut() {
            var shareScope = this.$scope.$new();
            shareScope.panel = this.panel.chartDataModel;
            shareScope.dashboard = this.dashboard;

            this.publishAppEvent('show-modal', {
              src: 'public/plugins/grafana-processline-panel/partials/shareModal.html',
              scope: shareScope
            });
          }
        }, {
          key: 'addUrl',
          value: function addUrl(nodeName, url) {
            var nodeDetails = this.panel.chartDataModel.nodes;
            if (singleProcess.name == nodeName) {
              var _iteratorNormalCompletion12 = true;
              var _didIteratorError12 = false;
              var _iteratorError12 = undefined;

              try {
                for (var _iterator12 = nodeDetails.Data[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                  var singleProcess = _step12.value;

                  singleProcess.url = url;
                }
              } catch (err) {
                _didIteratorError12 = true;
                _iteratorError12 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion12 && _iterator12.return) {
                    _iterator12.return();
                  }
                } finally {
                  if (_didIteratorError12) {
                    throw _iteratorError12;
                  }
                }
              }
            }
          }
        }]);

        return ProcessLineCtrl;
      }(MetricsPanelCtrl));

      _export('ProcessLineCtrl', ProcessLineCtrl);

      ProcessLineCtrl.templateUrl = 'partials/module.html';
    }
  };
});
//# sourceMappingURL=process_ctrl.js.map
