import Cookies from 'js-cookie'

export const LANGUAGE_KEY = '_ai_graph_language_'

export function getCookie(key) {
  return Cookies.get(key)
}

export function setCookie(key, val, expires) {
  if (expires) {
    Cookies.set(key, val, { expires })
  } else {
    Cookies.set(key, val)
  }
}
