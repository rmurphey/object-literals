// clicking on a list item loads some content
// using the list item's ID and hides content
// in sibling list items
$(document).ready(function() {
	$('#myFeature li')
		.append('<div/>')
		.click(function() {
			var $this = $(this);
			var $div = $this.find('div');
			$div.load('foo.php?item=' +
				$this.attr('id'), 
				function() {
					$div.show();
					$this.siblings()
						.find('div').hide();
				});
		});
});