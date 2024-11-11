import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import PostListView from '@/views/PostListView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'post-list',
    component: PostListView,
  },
  {
    path: '/post/:id(\\d+)',
    name: 'post',
    component: () => import(/* webpackChunkName: "post" */ '@/views/PostDetailedView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
