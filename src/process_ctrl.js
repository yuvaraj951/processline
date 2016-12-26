import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import {profiler} from 'app/core/profiler';
import {Emitter} from 'app/core/core';
import kbn from 'app/core/utils/kbn';
import config from 'app/core/config';
import TimeSeries from 'app/core/time_series2';
//import 'public/plugins/grafana-processline-panel/css/style1.css'
import {PanelCtrl} from 'app/plugins/sdk';
import {MetricsPanelCtrl, alertTab} from 'app/plugins/sdk';
import {QueryCtrl} from 'app/features/panel/query_ctrl';
import {ChartViewModel} from './flowchart/ChartViewModel';
import moment from 'moment';
import  './mydirective';
import  './drag_drop';
import './node-directive'
//import {top,left} from './drag_drop';

const unitFormats= [];
 const panelDefaults = {

      valueNameOptions:  ['min','max','avg', 'current', 'total', 'name'],
      valueName: 'avg',
      decimals:3,
      contentHtml:'',
      format: 'none',
       mode: "markdown",
       content: "# title",
      thresholds: '0,10',
      bgcolor:'white',
      colors: ['rgba(50, 172, 45, 1)', 'rgba(241, 255, 0, 1)', 'rgba(245, 54, 54, 1)'],
      Name:'Node',
      chartDataModel: {
        nodes:[



        ]

      },
    };
export class ProcessLineCtrl extends MetricsPanelCtrl {
  constructor($scope, $injector,$window,templateSrv, $sce) {
   super($scope, $injector,$window);
   this.$scope=$scope;
   this.templateSrv=templateSrv;
   this.$sce=$sce;
   _.defaults(this.panel, panelDefaults);
    this.CompanyName = "Process Line Montoring";

    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    //this.events.on('refresh', this.onRender.bind(this));
    this.events.on('render', this.render.bind(this));
    this.publishAppEvent('panel-initialized', {scope: this.$scope});
    //this.events.on('init-edit-mode', this.updateClock.bind(this));
    this.chartModel=new ChartViewModel(this.panel.chartDataModel)
    this.getUnits();
   // this.update();
    this.document=document;

 }
 onInitEditMode() {
     this.addEditorTab('Options', 'public/plugins/grafana-processline-panel/partials/Options.html', 4);
     this.addEditorTab('Process Options', 'public/plugins/grafana-processline-panel/partials/editor.html', 3);
     this.addEditorTab('Help', 'public/plugins/grafana-processline-panel/partials/help.html', 5);
     this.events.on('data-received', this.onDataReceived.bind(this));
     this.events.on('data-error', this.onDataError.bind(this));
     this.panel.unitFormats = kbn.getUnitFormats();
   }

publishAppEvent(evtName, evt) {
    this.$scope.$root.appEvent(evtName, evt);
  }

  setUnitFormat(subItem) {
      this.panel.format = subItem.value;
      this.render();
    }
  getUnits() {

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


                         onRender() {
                         if (this.panel.mode === 'html') {
                             this.updateContent(this.panel.content);
                         }
                         else if (this.panel.mode === 'text') {
                             this.renderText(this.panel.content);
                         }
                         this.renderingCompleted();
                     };
                     renderText(content) {
                         content = content
                             .replace(/&/g, '&amp;')
                             .replace(/>/g, '&gt;')
                             .replace(/</g, '&lt;')
                             .replace(/\n/g, '<br/>');
                         this.updateContent(content);
                     };
                     renderMarkdown(content) {
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
                     };
                     updateContent(html) {
                         try {

                             this.panel.contentHtml= this.$sce.trustAsHtml(this.templateSrv.replace(html, this.panel.scopedVars));
                         }
                         catch (e) {
                             console.log('Text panel error: ', e);
                             this.content = this.$sce.trustAsHtml(html);
                         }
                     };


   addNewNode(data) {

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
   			width:'80px',
   			thresholds: '0,10,20,30,40',
   			stages:'init,start,run,process,end',
   			colors: ['rgba(50, 172, 45, 1)', 'rgba(241, 255, 0, 1)', 'rgba(245, 54, 54, 1)','rgba(245, 54, 54, 1)','rgba(245, 54, 54, 1)'],
   			url:'',
   			Data: [


   			]

   		};

        //newNodeDataModel.Data.push(data)
   		this.chartModel.addNode(newNodeDataModel);

   	};

    getDecimalsForValue(value) {
        if (_.isNumber(this.panel.decimals)) {
          return {decimals: this.panel.decimals, scaledDecimals: null};
        }

        var delta = value / 2;
        var dec = -Math.floor(Math.log(delta) / Math.LN10);

        var magn = Math.pow(10, -dec),
          norm = delta / magn, // norm is between 1.0 and 10.0
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
        if (Math.floor(value) === value) { dec = 0; }

        var result = {};
        result.decimals = Math.max(0, dec);
        result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;

        return result;
      }

      onDataError(err) {
          this.onDataReceived([]);
        }

     onDataReceived(dataList) {
         this.series = dataList.map(this.seriesHandler.bind(this));
         var data={};
         this.setValues(data);
        this.data=data;
         console.log(this.data);
         this.updateNode(this.data);
         this.render(this.data);
     }

     seriesHandler(seriesData) {

         var series = new TimeSeries({
           datapoints: seriesData.datapoints,
           alias: seriesData.target,
           unit: false,
         });
         series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);

         return series;
     }
     setValues(data){
     if (this.series && this.series.length > 0) {
     			for(var i = 0; i < this.series.length; i++){
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
                					data[seriesItem.alias].Name=seriesItem.alias
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
     applyOverrides(seriesItemAlias){
     var seriesItem={}, colorData = {}, overrides = {};
     		console.info('applying overrides for seriesItem');
     		console.debug(seriesItemAlias);
     		console.debug(this.panel.chartDataModel.nodes);
     		for(var i=0; i<=this.panel.chartDataModel.nodes.length; i++){
     			console.debug('comparing:');
     			console.debug(this.panel.chartDataModel.nodes[i]);
     			for(var e of this.panel.chartDataModel.nodes) {
     			if (e.name == this.metricsNodeName){
     				overrides=seriesItemAlias;

     			}
     		}
          }

     		seriesItem.Name = overrides|| this.panel.Name;

     		return seriesItem;


     }

        updateNode(nodeData){
                  var dataKeys=Object.keys(nodeData);
                   console.log(dataKeys[0]);
                  var dataValues=Object.values(nodeData);
                   console.log(dataValues[0]);
                  console.log(dataValues);

               var SingleProcess=this.chartModel.data.nodes;

               for(var EachProcess of SingleProcess){

               var ProcessName=EachProcess.name;
               for(var i=0;i<=dataValues.length;i++){
                 if(ProcessName==dataKeys[i]){
                  var dataValue=dataValues[i];
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


        }


    render(data){

               this.updateNode(data);
              // this.chartModel=new ChartViewModel(this.panel.chartDataModel);
             	for(var e of this.panel.chartDataModel.nodes) {
                     var threshold=e.thresholds;
                     var values=threshold.split(",");
                     console.log(values);

                     var stages=e.stages;
                     var StagesArray=stages.split(",");
                     console.log(StagesArray);
                    var Value1=parseInt(values[0]);
                    console.log(Value1);
                    var Value2=parseInt(values[1]);
                      console.log(Value2);
                      var Value3=parseInt(values[2]);
                       console.log(Value3);
                     var Value4=parseInt(values[3]);
                     console.log(Value4);
                    var color=e.colors;
                      console.log(color);
                      console.log(color[0]);
                     var data;
                     for( var val of e.Data){
                         data=val.valueFormated;
                         }
                     console.log(data);

                      if(data<Value1){
                      e.stroke=color[0];
                      e.status=StagesArray[0];
                      console.log(e);
                      }
                      else if(data>Value1 && data<Value2){
                      e.stroke=color[1]
                      e.status=StagesArray[1];
                       console.log(e);
                      }
                      else if(data>Value2 && data<Value3){
                         e.stroke=color[2];
                         e.status=StagesArray[2];
                       console.log(e);
                        }
                        else if(data>Value3 && data<Value4){

                         e.stroke=color[3]
                         e.status=StagesArray[3];
                         console.log(e);
                         }
                         else if(data>Value4){
                           e.stroke=color[4]
                           e.status=StagesArray[4];
                              console.log(e);
                             }
                      //this.src=src;
                      //this.bordershadow=bordershadow;


             }


           //this.width="130px"


    }
   UpdateNodeMetrics(nodename){

   this.metricsNodeName=nodename;
         var nodeDetails=this.panel.chartDataModel.nodes;
            for(var singleProcess of nodeDetails){
                      if(singleProcess.name==this.metricsNodeName){
                             this.process=singleProcess;
                             console.log(this.process);

                             }

      }

   }


    DeleteNode(node){
    var nodeDelete=this.panel.chartDataModel.nodes;
     var index = nodeDelete.findIndex(function(o){
     return o.name === node;
     console.log(index);
    })
    nodeDelete.splice(index, 1);
}

   updateWidth(nodeName,nodeWidth){
     var nodeDetails=this.panel.chartDataModel.nodes;
         if(singleProcess.name==nodeName){
            for(var singleProcess of nodeDetails.Data){
                singleProcess.width=nodeWidth;
                }
             }
        }

   changeBgColor(color){
    this.panel.bgcolor=color;
    }

   updateThresholds(threshold){
        console.log(threshold);
        var thresholdValue=document.getElementById("thresold").value;;
        console.log(thresholdValue);


                            var nodeDetails=this.panel.chartDataModel.nodes;

                            for(var singleProcess of nodeDetails){
                                 if(singleProcess.name==threshold){

                                    singleProcess.thresholds=thresholdValue;


                                    console.log(this.panel.chartDataModel.nodes);

                                  }

                            }

    }
updateStatus(processName){
        console.log(processName);
        var statusName=document.getElementById("stages").value;;
        console.log(statusName);


                            var nodeDetails=this.panel.chartDataModel.nodes;

                            for(var singleProcess of nodeDetails){
                                 if(singleProcess.name==processName){

                                    singleProcess.stages=statusName;

                                     alert("successfully updated");
                                  }

                            }

    }

    changeColor(colorIndex, color,nodeName){

            var nodeDetails=this.panel.chartDataModel.nodes;

             for(var singleProcess of nodeDetails){
               if(singleProcess.name==nodeName){

               singleProcess.colors[colorIndex]=color;

             console.log(singleProcess);

                 }
            }




    	}

    	removeColor(colorIndex,nodeName){

                    var nodeDetails=this.panel.chartDataModel.nodes;

                     for(var singleProcess of nodeDetails){
                       if(singleProcess.name==nodeName){

                       singleProcess.colors.splice(colorIndex,1);


                         }
                    }


    	}

    	addColor(nodeName){

                            var nodeDetails=this.panel.chartDataModel.nodes;

                             for(var singleProcess of nodeDetails){

                               if(singleProcess.name==nodeName){

                               singleProcess.colors.push('rgba(255, 255, 255, 1)');

                                console.log(singleProcess.colors);
                                 }
                            }


    	}
     sharePanelDefalut() {
         var shareScope = this.$scope.$new();
         shareScope.panel = this.panel.chartDataModel;
         shareScope.dashboard = this.dashboard;

         this.publishAppEvent('show-modal', {
           src: 'public/plugins/grafana-processline-panel/partials/shareModal.html',
           scope: shareScope
         });



       }

       addUrl(nodeName,url){
            var nodeDetails=this.panel.chartDataModel.nodes;
             if(singleProcess.name==nodeName){
                for(var singleProcess of nodeDetails.Data){
                     singleProcess.url=url;
                 }
              }
         }

}

ProcessLineCtrl.templateUrl = 'partials/module.html';
