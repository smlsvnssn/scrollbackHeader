const absolute = 'absolute',
  scrollback = 'scrollback',
  fixed = 'fixed'

const withScrollback = (
  element,
  sideeffect,
  thresholdUp = 5,
  thresholdDown,
) => {
  let threshold = {
      up: thresholdUp,
      down: thresholdDown ?? thresholdUp,
    },
    state = {
      lastScrollY: 0,
      renderstate: absolute,
    }

  const elementTop = (
    (top = null, t = null) =>
    () => {
      // memoise for every animationframe
      t = t || requestAnimationFrame(() => (top = t = null))
      top =
        top ||
        element.getBoundingClientRect().top -
          document.body.getBoundingClientRect().top

      return top
    }
  )()

  const scrollDelta = () => state.lastScrollY - scrollY

  const isAboveThreshold = dir => Math.abs(scrollDelta()) > threshold[dir]

  const getRenderstate = state =>
    // up or down?
    scrollDelta() < 0 ?
      state === fixed && isAboveThreshold('down') ?
        absolute
      : null
      // overscroll?
    : state !== fixed && elementTop() + scrollDelta() >= scrollY ? fixed
      // scroll back in?
    : (
      state !== fixed &&
      isAboveThreshold('up') &&
      elementTop() < scrollY - element.offsetHeight
    ) ?
      scrollback
    : null

  const render = state => {
    switch (state) {
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
    let state = getRenderstate(state.renderstate)
    if (state) {
      state.renderstate = state
      render(state)
    }
    if (sideeffect) sideeffect(element, state.renderstate)
    state.lastScrollY = scrollY
  }

  const cache = {
    position: element.style.position,
    top: element.style.top,
    left: element.style.left,
    width: element.style.width,
    bodyPaddingTop: document.body.style.paddingTop,
    scrollHandler: onAnimationFrame(onScroll),
    resizeHandler: onAnimationFrame(() => {
      setBodyPadding()
      onScroll()
    }),
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
