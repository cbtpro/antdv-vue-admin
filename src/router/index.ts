import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import Settings from '@/views/Settings.vue';

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
              path: 'related-form',
              name: 'related-form',
              component: () => import('@/views/practices/SimpleFormPractices.vue'),
              meta: { title: '关联表单' }
            },
            {
              path: 'step-form',
              name: 'step-form',
              component: () => import('@/views/practices/step-form/index.vue'),
              meta: { title: '分步表单' }
            },

            {
              path: 'dynamic-form',
              name: 'dynamic-form',
              component: () => import('@/views/practices/dynamic-form-demo/index.vue'),
              meta: { title: '动态表单' }
            },
            {
              path: 'form',
              name: 'form',
              component: () => import('@/views/practices/FormPractices.vue'),
              meta: { title: '表单最佳实践' }
            },
            {
              path: 'basic',
              name: 'basic',
              component: () => import('@/views/practices/BasicForm.vue'),
              meta: { title: '基础表单' }
            },
            {
              path: 'dynamic',
              name: 'dynamic',
              component: () => import('@/views/practices/DynamicForm.vue'),
              meta: { title: '动态表单' }
            },
            {
              path: 'multi-step',
              name: 'multi-step',
              component: () => import('@/views/practices/MultiStepForm.vue'),
              meta: { title: '多步骤表单' }
            },
            {
              path: 'search',
              name: 'search',
              component: () => import('@/views/practices/SearchForm.vue'),
              meta: { title: '搜索表单' }
            },
            {
              path: 'advanced-filter',
              name: 'advanced-filter',
              component: () => import('@/views/practices/AdvancedFilterForm.vue'),
              meta: { title: '高级搜索表单' }
            },
            {
              path: 'table',
              name: 'table',
              component: () => import('@/views/practices/TableForm.vue'),
              meta: { title: '表格表单' }
            },
            {
              path: 'custom',
              name: 'custom',
              component: () => import('@/views/practices/CustomForm.vue'),
              meta: { title: '自定义表单' }
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
});

export default router;
