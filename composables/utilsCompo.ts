
import is from 'is_js'

export function todayYear() {
  return new Date().getFullYear()
}

export function isSmartPhone() {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i
  ]

  const match = toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem)
  })
  return match
}

export function isMobile() {
  return is.mobile() || is.tablet()
}

export function isLandscape() {
  const isLandscape = window.innerHeight < window.innerWidth
  return isLandscape
}

export function isFirefox() {
  return is.firefox()
}

export function isIe() {
  return is.ie()
}

export function isEdge() {
  return is.edge()
}

export function isSafariOrIOS() {
  return is.ios() || is.safari()
}

