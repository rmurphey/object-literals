jQuery(function(){
	
	var $ = jQuery; 
	
	// config variables
	var config = {
		xoAppUrl: '/app',
		xoImgUrl: ''
	};
	
	// content controller
	var cc = {
		mode : 'teaser',
		featureVisible : true,
		
		$loader : '<p class="loadingAnimation"><img height="32" src="' + 
				config.xoImgUrl + 
				'/images/ajax-loader.gif" width="32" /></p>',
		
		contactsFullUrl : config.xoAppUrl + 'modules/contact/loadContactForm.php?form_id=1',
		
		urls : {
			// one entry per mode
			'teaser' : 	config.xoAppUrl + 'modules/info/loadTeaser.php?sect=',
			'full' : 	config.xoAppUrl + 'modules/info/loadSection.php?sect='
		},
		
		showTab : function($li) {
			$li.data('contentArea').show().siblings().hide();
			$li.addClass('current').siblings().removeClass('current');
			
			cc.loadContent($li, function() {
				cc.showContent($li);
				cc.$currentTab = $li;
			});
			
		},
		
		showTabByName : function(tab, mode) {
			var $li = $('#tab_' + tab);
			if (mode != cc.mode) {
				cc.$currentTab = $li;
				cc.toggleMode();
			} else {
				cc.showTab($li);
			}
		},
		
		showContent : function($li) {
			var mode = $li.data('mode');
			var $bucket = $li.data(mode);
			var $contentArea = $li.data('contentArea');
			
			$bucket.show().siblings().hide();
		},
		
		loadContent : function($li,callback) {
			var callback = callback ? callback : function() { };
			var $c = $li.data('contentArea');
			var t = $li.data('tabName');
			var mode = $li.data('mode');
			var loaded = $li.data('loaded');
			var doLoad = true;
			
			if ($.inArray(mode, loaded) != -1) {
				doLoad = false;
			}
			
			if (doLoad) {
				$li.data('wait').show().siblings().hide();
				var url = (t == 'contact_us' && $li.data('mode') == 'full') ? 
					cc.contactsFullUrl : // exception for contact tab in full mode
					cc.urls[mode] + t; 
				$li.data(mode).load(
					url,
					function() {
						loaded.push(mode);
						$li.data('loaded', loaded);
						cc.enableModal($li);
						cc.enableMoreLinks($li);
						cc.fixEmail($li);
						callback();
					}
				);
			} else {
				callback();
			}
		},
		
		fixEmail : function($li) {
			var $spans = $li.data('contentArea').find('span.mail');
			$spans.fixEmail();
		},
		
		enableModal : function($li) {
			// hook up thickbox for a given content area
			var $c = $li.data('contentArea');
			$c.find('a.thickbox').unbind('click').click(function(e) {
				e.preventDefault();
				var $a = $(this);
				tb_show($a.attr('title'), $a.attr('href'), $a.attr('rel'));
			});
		},
		
		enableMoreLinks : function($li) {
			var $c = $li.data('contentArea');
			$c.find('div.readmore a').unbind('click').click(function(e) {
				e.preventDefault();
				cc.toggleMode();
			});
		},
		
		toggleMode : function() {
			// toggle mode of all tabs at once
			cc.mode = (cc.mode == 'teaser') ? 'full' : 'teaser';
			cc.$tabs.each(function() { 
				$(this).data('mode', cc.mode); 
			});
			
			switch (cc.mode) {
			
			case 'full':
				$('#expandtabs span').text('Minimize Tabs');
				$('#md_feature').slideUp('fast');
				cc.featureVisible = false;
			break;
			
			case 'teaser':
			default:
				$('#expandtabs span').text('Expand Tabs');
				$('#md_feature').slideDown('fast');
				cc.featureVisible = true;
			break;
							
			}
			
			cc.showTab(cc.$currentTab);
		},
		
		enableTab : function($li) {
			$li.bind('mouseover', function() { 
				switch ($li.data('mode')) {
				
				case 'full':
					// no mouseover behavior
				break;
				
				case 'teaser':
				default:
					cc.showTab($li); 
				break;
				
				}
			});
			
			$li.click(function(e){
				e.preventDefault();
				if ($li.hasClass('current')) {
					cc.$currentTab = $li;
					cc.toggleMode();
				} else {
					cc.showTab($li);
				}
			});
		},
		
		init : function() {
			$('#content').empty();
			
			// get all the tab li's
			cc.$tabs = $('#md_tabs_navigation li').each(function() {

				var $li = $(this);
				var href = $li.find('a').attr('href').split('/');
				var tab = href[href.length - 1].replace('.html','');
				
				if (tab) {
					var $contentArea = $('<div/>').appendTo('#content').hide();
					var $teaser = $('<div class="teaser" />').appendTo($contentArea);
					var $full = $('<div class="full" />').appendTo($contentArea);
					var $wait = $('<div class="wait" />').appendTo($contentArea).
						append(cc.$loader);

					$li.data('contentArea', $contentArea);
					$li.data('teaser', $teaser);
					$li.data('full', $full);
					$li.data('wait', $wait);
					
					$li.data('tabName', tab);
					$li.data('mode', 'teaser'); 
					$li.data('loaded', [ 'none' ]);
					$li.attr('id', 'tab_' + tab);
					
					// load the initial content for the tab into its content area
					cc.loadContent($li);
					cc.enableTab($li);
				} 
			});
			
			$('#expandtabs').css({cursor:'pointer'}).click(cc.toggleMode);
			cc.initialized = true;
			cc.showTab($('#md_tabs_navigation li:first'));
		}
	};
	
	cc.init();
});