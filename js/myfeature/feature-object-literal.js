var myFeature = {
	init : function(settings) {
		myFeature.config = {
			$items : $('#myFeature li'),
			urlBase : '/foo.php?item=',
			container : '<div class="container"></div>',
			containerSelector : 'div.container'
		};

		// allow overriding the default config
		$.extend(myFeature.config, settings);
		
		// set up the behavior
		myFeature.config.$items
			.append(myFeature.config.container)
			.click(function() {
				myFeature.showItem($(this));
			});
	},
	
	buildUrl : function($item) {
		return myFeature.config.urlBase + $item.attr('id');
	},
	
	showItem : function($item) {
		myFeature.getContent(
			$item, 
			function() {
				myFeature.showContent($item);
			}
		);
	},
	
	getContent : function($item, callback) {
		var url = myFeature.buildUrl($item);
		$item.find(myFeature.config.containerSelector).load(url, callback);
	},
	
	showContent : function($item) {
		$item.find(myFeature.config.containerSelector).show();
		myFeature.hideContent($item);
	},
	
	getItemsToHide : function($item) {
		return $item.siblings();
	},
	
	hideContent : function($item) {
		var $items = myFeature.getItemsToHide($item);
		$items.find(myFeature.config.containerSelector).hide();
	}
};

$(document).ready(myFeature.init);