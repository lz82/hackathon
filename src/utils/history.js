const storage = window.localStorage
const HISTORY_KEY = 'sstir_hackathon_search_history'

export function setHistory({ keyword, region, org }) {
  let history = storage.getItem(HISTORY_KEY)
  let arr = []
  if (history) {
    arr = JSON.parse(history)
    if (arr.length > 20) {
      arr.pop()
    }
  }
  arr.unshift({
    keyword,
    region,
    org
  })
  storage.setItem(HISTORY_KEY, JSON.stringify(arr))
}

export function getHistory() {
  let history = storage.getItem(HISTORY_KEY)
  if (history) {
    return JSON.parse(history)
  } else {
    return []
  }
}
