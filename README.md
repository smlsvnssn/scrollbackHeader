scrollbackHeader
================

scrollbackHeader creates a non-stupid-behaving semi-sticky top header, that sticks 
to the top when needed, and scrolls away when not needed. Simple!

#### Options:
* **adjustBodyMargin**, sets body margin to height of element if true (default: true).
* **centered**, centers element if true (default: false).
* **widthBounds**, lets you set window width bounds for when behaviour is active, max for 
maximum active width, min for minimum width (default: { max: -1, min: -1 }, i.e. false).

#### Demo:
http://stuff.lhli.net/scrollbackHeader or http://blog.lhli.net
Codepen: http://codepen.io/smlsvnssn/full/DumnE/

#### Known issues:
* Shaky on iOS and various other mobile browsers, due to scrollTop value not updating while scrolling. Hints on solutions much appreciated. Touch devices disabled for now.

#### Usage:
Call on window load instead of ready, to get the correct heights.
``` JavaScript
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
```
