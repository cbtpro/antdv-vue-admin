import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import Home from '../views/Home.vue'
import FormPractices from '../views/practices/FormPractices.vue'
import About from '../views/About.vue'
import Settings from '../views/Settings.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: Home,
          meta: { title: '首页' }
        },
        {
          path: 'practices',
          name: 'practices',
          meta: { title: '最佳实践' },
          children: [
            {
              path: 'form',
              name: 'form',
              component: FormPractices,
              meta: { title: '表单最佳实践' }
            }
          ]
        },
        {
          path: 'about',
          name: 'about',
          component: About,
          meta: { title: '关于' }
        },
        {
          path: 'settings',
          name: 'settings',
          component: Settings,
          meta: { title: '设置' }
        }
      ]
    }
  ]
})

export default router