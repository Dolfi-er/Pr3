import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue')
  },
  {
    path: '/iss',
    name: 'ISS Tracker',
    component: () => import('../views/IssView.vue'),
  },
  {
    path: '/jwst',
    name: 'JWST',
    component: () => import('../views/JwstView.vue')
  },
  {
    path: '/space',
    name: 'Space Data',
    component: () => import('../views/SpaceDataView.vue')
  },
  {
    path: '/astro',
    name: 'Astro Events',
    component: () => import('../views/AstroEventsView.vue')
  }/*,
  {
    path: '/apod',
    name: 'APOD',
    component: () => import('../views/ApodView.vue')
  },
  {
    path: '/telemetry',
    name: 'Telemetry',
    component: () => import('../views/TelemetryView.vue')
  }*/
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router