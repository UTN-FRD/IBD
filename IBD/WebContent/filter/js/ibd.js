var Manager;

(function ($) {

  $(function () {
    Manager = new AjaxSolr.Manager({
      //solrUrl: 'http://reuters-demo.tree.ewdev.ca:9090/reuters/'
      solrUrl: 'http://lsi.no-ip.org:8983/solr/comunicaciones/'
      // If you are using a local Solr instance with a "reuters" core, use:
      // solrUrl: 'http://localhost:8983/solr/reuters/'
      // If you are using a local Solr instance with a single core, use:
      // solrUrl: 'http://localhost:8983/solr/'
    });
    Manager.addWidget(new AjaxSolr.ResultWidget({
      id: 'result',
      target: '#docs'
    }));
    Manager.addWidget(new AjaxSolr.PagerWidget({
      id: 'pager',
      target: '#pager',
      prevLabel: '&lt;',
      nextLabel: '&gt;',
      innerWindow: 1,
      renderHeader: function (perPage, offset, total) {
        $('#pager-header').html($('<span></span>').text('mostrando ' + Math.min(total, offset + 1) + ' de ' + Math.min(total, offset + perPage) + ' de ' + total));
      }
    }));
    var fields = [ 'Nro_Origen', 'Nro_Destino', 'Tipo_Comunicacion', 'Duracion', 'Celda_Origen' ];
    for (var i = 0, l = fields.length; i < l; i++) {
      Manager.addWidget(new AjaxSolr.TagcloudWidget({
        id: fields[i],
        target: '#' + fields[i],
        field: fields[i]
      }));
    }
    Manager.addWidget(new AjaxSolr.TipoComunicacionWidget({
        id: 'Tipo_Comunicacion',
        target: '#Tipo_Comunicacion',
        field: 'Tipo_Comunicacion'
  	}));
    Manager.addWidget(new AjaxSolr.HighchartsWidget({
      id: 'highcharts-container',
      target: '#highcharts-container',
      field: 'Fecha_Origen'
	}));
    Manager.addWidget(new AjaxSolr.CurrentSearchWidget({
      id: 'currentsearch',
      target: '#selection'
    }));
    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'text',
      target: '#search',
      fields: [ 'Nro_Origen', 'Nro_Destino' ]
    }));
    /*
    Manager.addWidget(new AjaxSolr.CountryCodeWidget({
      id: 'countries',
      target: '#countries',
      field: 'Tipo_Comunicacion'
    }));
    */
    Manager.addWidget(new AjaxSolr.CalendarWidget({
      id: 'calendar',
      target: '#calendar',
      field: 'Fecha_Origen'
    }));
    
    Manager.init();
    
    //http://lsi.no-ip.org:8983/solr/comunicaciones/select?
    //rows=0&
    //q=*:*&
    //facet.range=Fecha_Origen&
    //facet=true&
    //facet.range.start=NOW/MONTH&
    //facet.range.end=NOW/MONTH%2B1MONTH&
    //facet.range.gap=%2B1DAY&
    //TZ=America/Los_Angeles&
    //json.nl=map&
    //wt=json&callback=?

    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
      'facet.field': [ 'Nro_Origen', 'Nro_Destino', 'Tipo_Comunicacion', 'Duracion', 'Celda_Origen' ],
      'facet.limit': 40,
      'facet.mincount': 1,
      'f.topics.facet.limit': 50,
      'f.Tipo_Comunicacion.facet.limit': -1,
      'facet.range': 'Fecha_Origen',
      //'facet.range.start' : 'NOW/MONTH-1YEAR',
      //'facet.range.end' : 'NOW',
      'facet.range.start': '2015-01-01T00:00:00.000Z/DAY',
      'facet.range.end': '2017-12-31T00:00:00.000Z/DAY+1DAY',
      'facet.range.gap': '+1DAY',
      'json.nl': 'map'
    };
    for (var name in params) {
      Manager.store.addByValue(name, params[name]);
    }
    Manager.doRequest();
  });

  $.fn.showIf = function (condition) {
    if (condition) {
      return this.show();
    }
    else {
      return this.hide();
    }
  }

})(jQuery);
