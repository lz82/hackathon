import { AppGet } from '@/utils/request'

export function getPatentList(data) {
  return AppGet('/patent/getPatentList', data)
}

export function getPaperList(data) {
  return AppGet('/paper/getPaperList', data)
}

export function getIndexVisual(data) {
  return AppGet('/patent/getIndexVisual', data)
}
