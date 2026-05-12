import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('../views/HomeView.vue')
const Post = () => import('../views/PostView.vue')
const NotFound = () => import('../views/NotFoundView.vue')

const routes = [
  { path: '/', component: Home },
  { path: '/post/:id', component: Post },
  { path: '/:pathMatch(.*)*', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router