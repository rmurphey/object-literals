// NAVIGATION
function togglePage(section) {
	// if the clicked section is already the current section AND we're in full page mode
	// minimize the current tab
	if (jQuery('#md_tab_'+ section).hasClass('current') && jQuery('#md_tab_'+ section + ' a').hasClass('md_fullpage')) {
		// alert('clicked section is current section AND fullpage mode is active; teaser should load');
	// Minimize
		jQuery('#md_tabs_navigation a').removeClass('md_fullpage');
		jQuery('.md_body').hide();
		jQuery('#md_feature').slideDown('normal',function(){
			var bodyContent = jQuery('#md_body_'+ section);
			bodyContent.fadeOut('normal',function(){
				jQuery('#md_tabs_navigation a').each(function(){
					var thisSection = jQuery(this).html().replace('<span<','').replace('<\/span<','');
					var thisSection_comp = thisSection.toLowerCase().replace(' ','_');
					jQuery('#md_body_'+ thisSection_comp).load(
						'/app/modules/info/loadTeaser.php?sect='+ thisSection_comp,
						function(){
							tb_init('.md_body a.thickbox, .md_body area.thickbox, .md_body input.thickbox');
							bodyContent.animate({ height: 'toggle', opacity: 'toggle' },"slow");
						}
					);
				});
			});
		});
		jQuery('#expandtabs span').empty().append('Expand Tabs');
	} else {
	// if the clicked section is NOT the current section OR we're NOT in full page mode
	// then let's go to full page mode and show the whole tab
	// Maximize
		// alert('clicked section is not the current section OR full page mode is not active; full section should load');
		jQuery('#md_tabs_navigation li').removeClass('current');
		jQuery('#md_tab_'+ section).addClass('current');
		jQuery('#md_tabs_navigation a').addClass('md_fullpage');
		jQuery('.md_body').hide();
		jQuery('#md_feature').slideUp('normal',function(){
			var bodyContent = jQuery('#md_body_'+ section);
			bodyContent.fadeOut('normal',function(){
				bodyContent.empty();
				var pageLoader = 'info/loadSection.php?sect='+ section;
				if (section == 'contact_us') {
					 pageLoader = 'contact/loadContactForm.php?form_id=1';
				}
				bodyContent.load('/app/modules/'+ pageLoader,function(){
					// ADD THICKBOXES
					tb_init('.md_body a.thickbox, .md_body area.thickbox, .md_body input.thickbox');
					$recent_news_links = jQuery('ul.md_news li a.recent_news_link');
					$recent_news_links
						.unbind('click')
						.each(function(){
							var hrefMod = this.href;
							hrefMod = hrefMod.replace(/article/,'loadNews').replace(/storyid/,'id');
							this.href = hrefMod;
						})
						.click(function(){
							var t = this.title || this.name || null;
							var a = this.href || this.alt;
							var g = this.rel || false;
							tb_show(t,a,g);
							this.blur();
							return false;
						});
					// ACCORDION
					jQuery('div.applemenu div.submenu').hide();  
					jQuery('div.applemenu div.silverheader < a').click(
						function(){
							jQuery('div.silverheader').removeClass('selected');
							jQuery(this).parent().addClass('selected');
							var $nextDiv = jQuery(this).parent().next('div.submenu');
							var $visibleSiblings = $nextDiv.siblings('div:visible.submenu');
							if ($visibleSiblings.length){
								$visibleSiblings.slideUp('fast',function(){
									$nextDiv.slideToggle('fast');
								});
							} else {
								$nextDiv.slideToggle('fast');
							}
						}
					);
					// SHOW CONTENT
					bodyContent.animate({ height: 'toggle', opacity: 'toggle' },"slow",function(){
						jQuery('#expandtabs span').empty().append('Minimize Tabs');
					});
				});
			});
		});
	}
}


// ENABLE EXPAND/MINIMIZE LINK
jQuery('div#expandtabs span').wrap('<a id="expandtabs_toggle"<<\/a<');
jQuery('a#expandtabs_toggle').click(function(){
	var currentTab = jQuery('ul#md_tabs_navigation li.current').attr('id').replace('md_tab_','');
	togglePage(currentTab);
});

// LOAD TEASER CONTENT FOR TAB ROLLOVERS
var currentSection = jQuery('#content h1').html();
jQuery('#md_tabs_navigation a').each(function(){
	var thisSection = jQuery(this).html().replace(/<\/?[^<]+</gi,'');
	var thisSection_comp = thisSection.toLowerCase().split(' ').join('_');
	jQuery(this).parent('li').attr({ id: 'md_tab_'+ thisSection_comp });
	if (thisSection == currentSection) {
		jQuery('.md_body').attr({ id: 'md_body_'+ thisSection_comp });
		jQuery(this).parent().addClass('current');
	} else {
		jQuery('#md_content').append('<div class="clearfix md_body" id="md_body_'+ thisSection_comp +'"<<\/div<');
		jQuery('#md_body_'+ thisSection_comp).hide();
	} 
	var $thisSection_content_div = jQuery('#md_body_'+ thisSection_comp);
	jQuery.ajax({
		url: '/app/modules/info/loadTeaser.php?sect='+ thisSection_comp,
		type: 'GET',
		dataType: 'html',
		beforeSend: function(){
			$thisSection_content_div.empty().append('<p class="loadingAnimation" id="loading_'+ thisSection_comp +'"<<img alt="" height="32" src="/images/ajax-loader.gif" width="32" /<<\/p<');
		},
		success: function(r){
			jQuery('#loading_' + thisSection_comp).remove();
			$thisSection_content_div.html(r);
			$recent_news_links = jQuery('ul.md_news li a.recent_news_link');
			$recent_news_links
				.unbind('click')
				.each(function(){
					var hrefMod = this.href;
					hrefMod = hrefMod.replace(/article/,'loadNews').replace(/storyid/,'id');
					this.href = hrefMod;
				})
				.click(function(){
					var t = this.title || this.name || null;
					var a = this.href || this.alt;
					var g = this.rel || false;
					tb_show(t,a,g);
					this.blur();
					return false;
				});
			jQuery('.md_body a.thickbox, .md_body area.thickbox, .md_body input.thickbox').unbind('click');
			tb_init('.md_body a.thickbox, .md_body area.thickbox, .md_body input.thickbox');
			jQuery('.readmore a', $thisSection_content_div).unbind().click(function(){
				var readMore_comp = jQuery(this).parent('div').parent('div').attr('id').replace('md_body_','');
				togglePage(readMore_comp);
				return false;
			});
		}
	});


	if (thisSection_comp != 'home') {
		jQuery(this).hover(
			function(){
				if (jQuery(this).hasClass('md_fullpage')) {
				} else {
					jQuery('#md_tabs_navigation li').removeClass('current');
					jQuery(this).parent().addClass('current');
					jQuery('#md_body_'+ thisSection_comp).show().siblings().hide();
				}
			},
			function(){
			}
		).click(
			function(){
				togglePage(thisSection_comp);
				return false;
			}
		);
	}
});