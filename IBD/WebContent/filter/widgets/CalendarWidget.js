(function ($) {

AjaxSolr.CalendarWidget = AjaxSolr.AbstractFacetWidget.extend({
  afterRequest: function () {
    var self = this;
    var startDate = $.datepicker.parseDate('yy-mm-dd', this.manager.store.get('facet.range.start').val().substr(0, 10));
    var endDate = $.datepicker.parseDate('yy-mm-dd', this.manager.store.get('facet.range.end').val().substr(0, 10));
    $(this.target).datepicker('destroy').datepicker({
      dateFormat: 'yy-mm-dd',
      defaultDate: new Date(1987, 2, 1),
      maxDate: endDate,
      minDate: startDate,
      nextText: '&gt;',
      prevText: '&lt;',
      beforeShowDay: function (date) {
        var value = $.datepicker.formatDate('yy-mm-dd', date) + 'T00:00:00Z';
        var count = self.manager.response.facet_counts.facet_ranges[self.field].counts[value];
        return [ parseInt(count) > 0, '', count + ' documents found!' ];
      },
      onSelect: function (dateText, inst) {
        if (self.add('[' + dateText + 'T00:00:00Z TO ' + dateText + 'T23:59:59Z]')) {
          self.doRequest();
        }
      }
    });
    /*
    $( "#slider-range" ).slider({
        range: true,
        min: new Date(startDate).getTime() / 1000,
        max: new Date(endDate).getTime() / 1000,
        step: 86400,
        values: [ new Date(startDate).getTime() / 1000, new Date(endDate).getTime() / 1000 ],
        slide: function( event, ui ) {
          $( "#amount" ).val( (new Date(ui.values[ 0 ] *1000).toLocaleDateString() ) + " - " + (new Date(ui.values[ 1 ] *1000)).toLocaleDateString() );
        },
        stop: function( event, ui ) {
        	var dateFrom = new Date(ui.values[ 0 ] *1000);
        	var dateTo = new Date(ui.values[ 1 ] *1000);
        	$( "#slider-range" ).slider( "option", "min", dateFrom.getTime() / 1000 );
        	$( "#slider-range" ).slider( "option", "max", dateTo.getTime() / 1000 );
        	$( "#amount" ).val( dateFrom.toLocaleDateString() + " - " + dateTo.toLocaleDateString() );
        	if (self.add('[' + dateFrom.getFullYear()+'-'+(dateFrom.getMonth()+1)+'-'+dateFrom.getDate() + 'T00:00:00Z TO ' + dateTo.getFullYear()+'-'+(dateTo.getMonth()+1)+'-'+dateTo.getDate()  + 'T23:59:59Z]')) {
                self.manager.store.params['facet.range.start'].value = dateFrom.getFullYear()+'-'+(dateFrom.getMonth()+1)+'-'+dateFrom.getDate() + 'T00:00:00Z';
                self.manager.store.params['facet.range.end'].value = dateTo.getFullYear()+'-'+(dateTo.getMonth()+1)+'-'+dateTo.getDate() + 'T23:59:59Z';
        		self.doRequest();
            }
        }
      });
      
      $( "#amount" ).val( (new Date($( "#slider-range" ).slider( "values", 0 )*1000).toLocaleDateString()) + " - " + (new Date($( "#slider-range" ).slider( "values", 1 )*1000)).toLocaleDateString());
     */
  }
});

})(jQuery);
