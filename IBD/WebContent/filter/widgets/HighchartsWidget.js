(function($) {

	
	AjaxSolr.HighchartsWidget = AjaxSolr.AbstractFacetWidget.extend({
		afterRequest : function() {
		    var self = this;
			var dataValues = new Array();
		    for (var facet in this.manager.response.facet_counts.facet_ranges[this.field].counts) {
                var count = this.manager.response.facet_counts.facet_ranges[this.field].counts[facet];
                dataValues.push([(new Date(facet)).getTime(), count]);
		    }

		    //var dataValues = this.manager.response.facet_counts.facet_ranges[this.field].counts;
		    
			stockChart = Highcharts.stockChart(this.id, {
				rangeSelector : {selected : 5},
				title : {text : 'Llamadas Por dia'},
				series : [ {
					name : 'Comunicaciones',
					data : dataValues
				} ],
				exporting: { 
				    buttons: {
				        customButton: {
				            x: -42,
				            onclick: function (e) {
					        	var dateFrom = new Date($(".highcharts-range-selector[name='min']").val());
					        	var dateTo = new Date($(".highcharts-range-selector[name='max']").val());
					        	if (self.add('[' + dateFrom.getFullYear()+'-'+(dateFrom.getMonth()+1)+'-'+dateFrom.getDate() + 'T00:00:00Z TO ' + dateTo.getFullYear()+'-'+(dateTo.getMonth()+1)+'-'+dateTo.getDate()  + 'T23:59:59Z]')) {
					                self.manager.store.params['facet.range.start'].value = dateFrom.getFullYear()+'-'+(dateFrom.getMonth()+1)+'-'+dateFrom.getDate() + 'T00:00:00Z';
					                self.manager.store.params['facet.range.end'].value = dateTo.getFullYear()+'-'+(dateTo.getMonth()+1)+'-'+dateTo.getDate() + 'T23:59:59Z';
					        		self.doRequest();
					            }
				            },
				            _id: 'myButton',
			                symbol: 'url(images/filter.png)',
			                symbolX:20,
			                symbolY:18,
			                symbolFill: '#B5C9DF',
			                hoverSymbolFill: '#779ABF',
				        }
				    }
				}
			});
			
			// the button action
			$('#applyFilter').click(function () {
				
	        	var dateFrom = new Date($(".highcharts-range-selector[name='min']").val());
	        	var dateTo = new Date($(".highcharts-range-selector[name='max']").val());
	        	if (self.add('[' + dateFrom.getFullYear()+'-'+(dateFrom.getMonth()+1)+'-'+dateFrom.getDate() + 'T00:00:00Z TO ' + dateTo.getFullYear()+'-'+(dateTo.getMonth()+1)+'-'+dateTo.getDate()  + 'T23:59:59Z]')) {
	                self.manager.store.params['facet.range.start'].value = dateFrom.getFullYear()+'-'+(dateFrom.getMonth()+1)+'-'+dateFrom.getDate() + 'T00:00:00Z';
	                self.manager.store.params['facet.range.end'].value = dateTo.getFullYear()+'-'+(dateTo.getMonth()+1)+'-'+dateTo.getDate() + 'T23:59:59Z';
	    			$('#removeDateFilter').show();
	        		self.doRequest();
	            }


			});

			// the button action
			$('#removeDateFilter').click(function () {
				var fq = self.manager.store.values('fq');
			    for (var i = 0, l = fq.length; i < l; i++) {
			    	if(fq[i].indexOf(self.field)>=0){
			    		if (self.manager.store.removeByValue('fq', fq[i])) {
			    			$('#removeDateFilter').hide();
			    	        self.doRequest();
			    	        return;
			    	    }
			    	}
			    }
			});

		}

	});

})(jQuery);
