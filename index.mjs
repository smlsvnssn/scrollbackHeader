const withScrollback = (
	element,
	sideeffect,
	thresholdUp = 5,
	thresholdDown,
) => {
	const absolute = 'absolute',
		scrollback = 'scrollback',
		fixed = 'fixed',
		threshold = {
			up: thresholdUp,
			down: thresholdDown ?? thresholdUp,
		},
		state = {
			lastScrollY: 0,
			renderstate: absolute,
		}

	const elementTop = ((top, t) => () => {
		t = t || setTimeout(() => (top = t = null)) // memoise for every animationframe
		return (
			top ||
			element.getBoundingClientRect().top -
				document.body.getBoundingClientRect().top
		)
	})()

	const scrollDelta = () => state.lastScrollY - scrollY

	const aboveThreshold = dir => Math.abs(scrollDelta()) > threshold[dir]

	const getRenderstate = s =>
		scrollDelta() < 0 // up or down?
			? s === fixed && aboveThreshold('down')
				? absolute
				: null
			: s !== fixed && elementTop() + scrollDelta() >= scrollY // overscroll?
			? fixed
			: s !== fixed &&
			  aboveThreshold('up') &&
			  elementTop() < scrollY - element.offsetHeight // scroll back in?
			? scrollback
			: null

	const render = s => {
		switch (s) {
			case absolute:
				element.style.position = 'absolute'
				element.style.top = scrollY + scrollDelta() + 'px'
				return
			case scrollback:
				element.style.top =
					scrollY + scrollDelta() - element.offsetHeight + 'px'
				return
			case fixed:
				element.style.position = 'fixed'
				element.style.top = 0
		}
	}

	const onAnimationFrame = (f, t) => () => {
		cancelAnimationFrame(t)
		t = requestAnimationFrame(f)
	}

	const onScroll = () => {
		const s = getRenderstate(state.renderstate)
		s && ((state.renderstate = s), render(s))
		sideeffect && sideeffect(element, state.renderstate)
		state.lastScrollY = scrollY
	}

	const cache = {
		position: element.style.position,
		top: element.style.top,
		left: element.style.left,
		width: element.style.width,
		bodyPaddingTop: document.body.style.paddingTop,
		scrollHandler: onAnimationFrame(onScroll),
		resizeHandler: () => {
			setBodyPadding()
			cache.scrollHandler()
		},
	}

	const destroy = () => {
		element.style.position = cache.position
		element.style.top = cache.top
		element.style.left = cache.left
		element.style.width = cache.width
		document.body.style.paddingTop = cache.bodyPaddingTop

		removeEventListener('scroll', cache.scrollHandler)
		removeEventListener('resize', cache.resizeHandler)
	}

	const setBodyPadding = () =>
		(document.body.style.paddingTop = element.offsetHeight + 'px')

	const init = () => {
		setBodyPadding()
		element.style.width = '100%'
		element.style.left = 0

		addEventListener('scroll', cache.scrollHandler)
		addEventListener('resize', cache.resizeHandler)

		cache.scrollHandler()
	}

	init()

	return { destroy }
}

export default withScrollback

//sb = withScrollback(document.querySelector('header'))
//sb.destroy()
