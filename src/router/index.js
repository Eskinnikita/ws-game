import { createRouter, createWebHistory } from 'vue-router';
import ConnectionView from '@/views/ConnectionView.vue';
import RoomView from '@/views/RoomView.vue';

const routes = [
  {
    path: '/',
    name: 'connection',
    component: ConnectionView
  },
  {
    path: '/room/:id',
    name: 'room',
    component: RoomView
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
