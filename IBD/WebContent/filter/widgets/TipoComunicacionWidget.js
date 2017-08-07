(function ($) {
/*
<ul id="tipo-comunicacion" class="nav nav-pills" role="tablist">
	<li id="todas" role="presentation" class="active"><a href="#">Todos</a></li>
	<li role="presentation"><a href="#">Llamadas <span id="cantidad-llamadas" class="badge">80318</span></a></li>
	<li role="presentation"><a href="#">Mensajes <span id="cantidad-mensajes" class="badge">39554</span></a></li>
</ul>
*/
AjaxSolr.TipoComunicacionWidget = AjaxSolr.AbstractFacetWidget.extend({

  afterRequest: function () {
	var self = this;
	
	var facetField = 'Tipo_Comunicacion';

	$('#tipo-comunicacion>li').removeClass('active');
    if (this.manager.response.facet_counts.facet_fields[facetField] === undefined) {
      $('#tipo-comunicacion>li').first().addClass('active');
      return;
    }

    var fq = this.manager.store.values('fq');
    for (var i = 0, l = fq.length; i < l; i++) {
    	if(fq[i].indexOf(facetField)>=0){
    		$('#tipo-comunicacion>li').first().click(self.removeFacet(fq[i]));
    	}
    }
    
    $('#cantidad-Llamada').parent().click(function(){
    	var fq = self.manager.store.values('fq');
        for (var i = 0, l = fq.length; i < l; i++) {
        	if(fq[i].indexOf(facetField)>=0){
        		self.manager.store.removeByValue('fq', fq[i]);
        	}
        }
        
    	if (self.add('Llamada')) {
    		self.doRequest();
        }
    });
    $('#cantidad-Mensaje').parent().click(function(){
    	var fq = self.manager.store.values('fq');
        for (var i = 0, l = fq.length; i < l; i++) {
        	if(fq[i].indexOf(facetField)>=0){
        		self.manager.store.removeByValue('fq', fq[i]);
        	}
        }

        if (self.add('Mensaje')) {
    		self.doRequest();
        }
    });
    
    
    var objectedItems = [];
    for (var facet in this.manager.response.facet_counts.facet_fields[facetField]) {
      var count = parseInt(this.manager.response.facet_counts.facet_fields[facetField][facet]);
      $('#cantidad-'+facet).html(count);
      $('#cantidad-'+facet).parent().click(this.clickHandler(facet))
      objectedItems.push({ facet: facet, count: count });
    }
    objectedItems.sort(function (a, b) {
      return a.facet < b.facet ? -1 : 1;
    });

    var filtered = false;

	var fq = this.manager.store.values('fq');
	for (var i = 0, l = fq.length; i < l; i++) {
		if(fq[i].indexOf(facetField)!== -1){
			$('#cantidad-'+facet).parent().parent().addClass('active');
		    filtered = true;
		}
	}
    
    if(!filtered)
    	$('#tipo-comunicacion>li').first().addClass('active');
  },
  removeFacet: function (facet) {
	    var self = this;
	    return function () {
	      if (self.manager.store.removeByValue('fq', facet)) {
	        self.doRequest();
	      }
	      return false;
	    };
  }
});

})(jQuery);


