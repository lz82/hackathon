import Vue from 'vue'
import VueRouter from 'vue-router'

const Entry = () => import(/* webpackChunkName: "home" */ '@/views/entry')
const Home = () => import(/* webpackChunkName: "home" */ '@/views/home')
const Search = () => import(/* webpackChunkName: "search" */ '@/views/search')
const Report = () => import(/* webpackChunkName: "report" */ '@/views/report')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'entry',
    component: Entry
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/search',
    name: 'search',
    component: Search
  },
  {
    path: '/report',
    name: 'report',
    component: Report
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
