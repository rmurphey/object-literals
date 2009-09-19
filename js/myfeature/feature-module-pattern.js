$(document).ready(function() {
	var myFeature = function(settings) {
		var myFeature = {};

		var _config = {
			$items : $('#myFeature li'),
			urlBase : '/foo.php?item=',
			container : '<div class="container"></div>',
			containerSelector : 'div.container'
		};

		// private methods named with an underscore
		// (this is a convention, not required)
		var _getContent = function($item, callback) {
			var url = _buildUrl($item);
			$item.find(_config.containerSelector).load(url, callback);
		};

		var _showContent = function($item) {
			$item.find(_config.containerSelector).show();
			_hideContent($item);
		};

		var _buildUrl = function($item) {
			return _config.urlBase + $item.attr('id');
		};

		var _hideContent = function($item) {
			var $items = $item.siblings();
			$items.find(_config.containerSelector).hide();
		};

		// this will be a public method, but it's not yet
		var showItem = function($item) {
			_getContent(
				$item, 
				function() { _showContent($item); }
			);
		};

		// set up the behavior
		_config.$items
			.append(_config.container)
			.click(function() {
				var $this = $(this);
				showItem($this);
			});

		// make the showItem method public
		myFeature.showItem = showItem;

		// make the list of items public
		myFeature.$items = _config.$items;

		return myFeature;

	// self-executing function
	}();

	myFeature.showItem(myFeature.$items.eq(0));
});