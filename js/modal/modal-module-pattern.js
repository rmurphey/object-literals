/** 
 * modal object to demonstrate the object literal principle;
 * would need some work to deal with cross-browser issues :)
 */
var createModal = function() {
	var $modal = $('<div id="modal"/>')
		.appendTo('body')
		.hide();
		
	var $content = $('<div id="modal_content"/>')
		.appendTo($modal);

	var $overlay = $('<div id="overlay"/>')
		.appendTo('body')
		.hide()
		.css({opacity:0.8})
		.click(hide);
		
	$('<p class="closer">Close</p>')
		.insertBefore($content)
		.click(hide);

	var show = function() {
		$modal.fadeIn(300);
		$overlay.show();
	};

	var populate = function(html) {
		$content.html(html);
		show();
	};

	var hide = function() {
		$modal.fadeOut(300);
		$overlay.hide();
	};
	
	return {
		hide : hide,
		populate : populate
	};
	
};
 
$(document).ready(function() {
	var modal = createModal();
	
	var $links = $('#menus a');
	if ($links.length) {
		$links.click(function(e) {
			e.preventDefault();
			var href = $(this).attr('href');
			$.ajax({
				url : href,
				dataType : 'html',
				type : 'GET',
				success : function(html) {
					modal.populate(html);
				}
			});
		});
	}
});