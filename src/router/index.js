import { createRouter, createWebHistory } from 'vue-router'
import GameView from '@/views/GameView.vue'
import ConnectionView from "@/views/ConnectionView.vue";

const routes = [
  {
    path: '/',
    name: 'connection',
    component: ConnectionView
  },
  {
    path: '/game/:id',
    name: 'game',
    component: GameView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
