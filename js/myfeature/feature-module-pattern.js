var createFeature = function(settings) {
	var myFeature = {};
	
	var _config = {
		$items : $('#myFeature li'),
		urlBase : 'foo.php?item=',
		container : 'div.container'
	};
	
	// allow overriding default config
	$.extend(_config, settings);
	
	// private methods named with an underscore
	// (this is a convention, not required)
	var _getContent = function($item, callback) {
		var url = _buildUrl($item);
		$item.load(url, callback);
	};

	var _showContent = function($item) {
		$item.find(_config.container).show();
		_hideContent($item);
	};

	var _buildUrl = function($item) {
		return _config.urlBase + $item.attr('id');
	};

	var _getItemsToHide = function($item) {
		return $item.siblings();
	};

	var _hideContent = function($item) {
		var $items = _getItemsToHide($item);
		$items.find(_config.container).hide();
	};
	
	// this will be a public method, but it's not yet
	var showItem = function($item) {
		_getContent(
			$item, 
			function() { _showContent($item); }
		);
	};

	// set up the behavior
	config.$items
		.append(_config.container)
		.click(function() {
			var $this = $(this);
			showItem($this);
		});
	
	// make the showItem method public
	myFeature.showItem = showItem;
	
	// make the list of items public
	myFeature.$items = config.$items;

	return myFeature;

};

$(document).ready(function() {
	var myFeature = createFeature();
	myFeature.showItem(myFeature.$items.eq(0));
});