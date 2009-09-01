var myFeature = {
	config : { },
	
	init : function(settings) { },
	
	buildUrl : function($item) { },
	
	showItem : function($item) { },
	
	getContent : function($item, callback) { },
	
	showContent : function($item) { },
	
	getItemsToHide : function($item) { },
	
	hideContent : function($item) { }
};

$(document).ready(myFeature.init);