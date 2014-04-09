/*

© 2014 lhli.net.
Licence: http://creativecommons.org/licenses/by-sa/3.0/

scrollbackHeader creates a non-stupid-behaving semi-sticky top header, that sticks 
to the top when needed, and scrolls away when needed. Simple!

Options:
adjustBodyMargin, sets body margin to height of element if true (default: true).
centered, centers element if true (default: false).
widthBounds, lets you set window width bounds for when behaviour is active, max for 
maximum active width, min for minimum width (default: { max: -1, min: -1 }, i.e. false).

Usage:
Call on window load instead of ready, to get the correct heights.

$( window ).load( function (){
	var options = {
		adjustBodyMargin: true, 
		centered: false,
		widthBounds: {
			max: 1200,
			min: 768
		}
	}
	$( '#header' ).scrollbackHeader( options );
});

*/

(function($) {
    $.scrollbackHeader = function(element, options) {
		'use strict';

		var defaults = {
			adjustBodyMargin: true,
			centered: false,
			widthBounds: {
				max: -1,
				min: -1,
			}
		},
		$element = $(element),
		element = element,
		plugin = this,
		$window = $(window),
		firstScrollUp = true,
		checkWidthBounds = true,
		lastScrollTop = 0,
		scrollTop,
		elementTop;
		
		plugin.settings = {};

		plugin.init = function() {
			plugin.settings = $.extend( true, {}, defaults, options );
			
			// set overflow:auto just in case
			$element.css({
				overflow: 'auto'
			});

			// set body margin
			if ( plugin.settings.adjustBodyMargin == true ) {
				$('body').css({
					'margin-top': $element.outerHeight(true)
				});
			};
			
			// adjust bounds settings
			if ( plugin.settings.widthBounds.min >= 0 || plugin.settings.widthBounds.max >= 0 ) {
				plugin.settings.widthBounds.min = ( plugin.settings.widthBounds.min == -1 ) ? 0 : plugin.settings.widthBounds.min;
				plugin.settings.widthBounds.max = ( plugin.settings.widthBounds.max == -1 ) ? 100000 : plugin.settings.widthBounds.max;
			} else {
				checkWidthBounds = false;
			}
			
			// bind to events
			$window.scroll(onScroll);
			$window.resize(onResize);
			
			// initial calls
			setAbsolute($window.scrollTop());
			onResize();
		}

		function onScroll(e){
			// check window width bounds			
			if ( !checkWidthBounds || ( $window.width() > plugin.settings.widthBounds.min && $window.width() < plugin.settings.widthBounds.max ) ) {
				scrollTop = $window.scrollTop();
			   	if ( scrollTop > lastScrollTop ){
					// scroll down
					if ( firstScrollUp  && $element.css('position') === 'fixed') {
						setAbsolute(scrollTop);
					};
					firstScrollUp = false;
				} else {
					// scroll up
					elementTop = $element.css('top').replace(/[^-\d\.]/g, '');
					
					if ( !firstScrollUp && scrollTop > 0 && elementTop < scrollTop - $element.outerHeight(true) ) {
						$element.css({
							top: scrollTop - $element.outerHeight(true)
						})
					};
					
					if ( elementTop > scrollTop ) {
						setFixed();
					};
					
					firstScrollUp = true;
				}

				lastScrollTop = scrollTop;
			
			} else {
				// clear effects. Potential conflict with other plugins using style on body tag.
				$element.removeAttr('style');
				$('body').removeAttr('style');
			}
		}
		
		function onResize(e){
			if (plugin.settings.centered) {
				center();
			};
			onScroll();
		}
		
		function center(){
			$element.css({
				left: Math.max(($window.width()/2) - ($element.outerWidth(true)/2), 0)
			});
		}
		
		function setFixed(){
			$element.css({
				position: 'fixed',
				top: 0
			});
		}
		
		function setAbsolute(scrollTop){
			$element.css({
				position: 'absolute',
				top: Math.max(scrollTop, 0)
			})
		}

		plugin.init();
	}

	$.fn.scrollbackHeader = function(options) {
		return this.each(function() {
			if (undefined == $(this).data('scrollbackHeader')) {
				var plugin = new $.scrollbackHeader(this, options);
				$(this).data('scrollbackHeader', plugin);
			}
		});
	}
})(jQuery);