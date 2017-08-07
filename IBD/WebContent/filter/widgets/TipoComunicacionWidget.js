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
	$('#tipo-comunicacion>li').removeClass('active');
    if (this.manager.response.facet_counts.facet_fields['Tipo_Comunicacion'] === undefined) {
      $('#tipo-comunicacion>li[0]').addClass('active');
      return;
    }

    
    $('#tipo-comunicacion>li[0]').click(this.removeFacet('Tipo_Comunicacion'))
    
    var objectedItems = [];
    for (var facet in this.manager.response.facet_counts.facet_fields['Tipo_Comunicacion']) {
      var count = parseInt(this.manager.response.facet_counts.facet_fields['Tipo_Comunicacion'][facet]);
      $('#cantidad-'+facet).html(count);
      $('#cantidad-'+facet).parent().click(this.clickHandler(facet))
      objectedItems.push({ facet: facet, count: count });
    }
    objectedItems.sort(function (a, b) {
      return a.facet < b.facet ? -1 : 1;
    });

    $(this.target).empty();

    var filtered = false;

    	if(this.manager.store.get('q').val().indexOf('Tipo_Comunicacion')!== -1 ){
    		$('#tipo-comunicacion>li[0]').addClass('active');
    		filtered = true;
    	}else{
    		var fq = this.manager.store.values('fq');
    		for (var i = 0, l = fq.length; i < l; i++) {
    			$('#tipo-comunicacion>li[0]').addClass('active');
    			if(fq[i].indexOf('Tipo_Comunicacion')!== -1){
    				$('#cantidad-'+facet).addClass('active');
    			      filtered = true;
    			}
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


