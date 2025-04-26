<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  HomeOutlined,
  FormOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PushpinOutlined
} from '@ant-design/icons-vue'
import TabsView from '../components/TabsView.vue'

const collapsed = ref<boolean>(false)
const router = useRouter()
const selectedKeys = ref<string[]>(['home'])
const openKeys = ref<string[]>(['practices'])

const menuItems = [
  {
    key: 'home',
    icon: HomeOutlined,
    label: '首页',
    path: '/'
  },
  {
    key: 'practices',
    icon: FormOutlined,
    label: '最佳实践',
    children: [
      {
        key: 'form',
        label: '表单最佳实践',
        path: '/practices/form'
      }
    ]
  },
  {
    key: 'about',
    icon: InfoCircleOutlined,
    label: '关于',
    path: '/about'
  },
  {
    key: 'settings',
    icon: SettingOutlined,
    label: '设置',
    path: '/settings'
  }
]

const handleMenuClick = (key: string) => {
  const findPath = (items: any[]): string | undefined => {
    for (const item of items) {
      if (item.key === key) return item.path
      if (item.children) {
        const path = findPath(item.children)
        if (path) return path
      }
    }
    return undefined
  }

  const path = findPath(menuItems)
  if (path) {
    router.push(path)
  }
}
</script>

<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo" />
      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        theme="dark"
        mode="inline"
        @select="({ key }) => handleMenuClick(key)"
      >
        <template v-for="item in menuItems" :key="item.key">
          <template v-if="item.children">
            <a-sub-menu :key="item.key">
              <template #icon>
                <component :is="item.icon" />
              </template>
              <template #title>{{ item.label }}</template>
              <a-menu-item v-for="child in item.children" :key="child.key">
                {{ child.label }}
              </a-menu-item>
            </a-sub-menu>
          </template>
          <template v-else>
            <a-menu-item :key="item.key">
              <template #icon>
                <component :is="item.icon" />
              </template>
              <span>{{ item.label }}</span>
            </a-menu-item>
          </template>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined
          v-else
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
      </a-layout-header>
      <TabsView />
      <a-layout-content style="margin: 16px">
        <router-view></router-view>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Ant Design Vue ©2024 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}
</style>