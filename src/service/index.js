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

export function domesticDistribution(data) {
  return AppGet('/patent/domesticDistribution', data)
}

export function innovationActivity(data) {
  return AppGet('/patent/innovationActivity', data)
}

export function techTalent(data) {
  return AppGet('/paper/techTalent', data)
}
