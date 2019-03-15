import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('./views/Login.vue')
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('./views/Index.vue'),
      children: [
        {
          path: 'talent',
          name: 'talent',
          component: () => import('./views/Talent.vue')
        },
        {
          path: 'position',
          name: 'position',
          component: () => import('./views/Position.vue')
        }
      ]
    }
  ]
})
