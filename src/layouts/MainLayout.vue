<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Menu as AMenu } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import {
  HomeOutlined,
  FormOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons-vue';
import TabsView from '../components/TabsView.vue';
import HeaderActions from '../components/HeaderActions.vue';
import { useAppStore } from '../stores/app';
// import { SelectInfo } from 'ant-design-vue/es/menu/src/interface';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['home']);
const openKeys = ref<string[]>(['practices']);

// 计算主题相关的样式
// const themeStyles = computed(() => ({
//   background: appStore.theme === 'dark' ? '#141414' : '#fff',
//   color: appStore.theme === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.85)'
// }));

const headerStyles = computed(() => ({
  background: appStore.theme === 'dark' ? '#1f1f1f' : '#fff',
  color: appStore.theme === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.85)',
  borderBottom: `1px solid ${appStore.theme === 'dark' ? '#303030' : '#f0f0f0'}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}));

const contentStyles = computed(() => ({
  background: appStore.theme === 'dark' ? '#141414' : '#f0f2f5',
  color: appStore.theme === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.85)'
}));

const footerStyles = computed(() => ({
  background: appStore.theme === 'dark' ? '#1f1f1f' : '#f0f0f0',
  color: appStore.theme === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.85)',
  textAlign: 'center'
}));

// 动态构建菜单项，确保语言切换时菜单标签会更新
const getMenuItems = () => [
  {
    key: 'home',
    icon: HomeOutlined,
    label: t('menu.home'),
    path: '/'
  },
  {
    key: 'practices',
    icon: FormOutlined,
    label: t('menu.practices'),
    children: [
      {
        key: 'form',
        label: t('menu.form'),
        path: '/practices/form'
      }
    ]
  },
  {
    key: 'about',
    icon: InfoCircleOutlined,
    label: t('menu.about'),
    path: '/about'
  },
  {
    key: 'settings',
    icon: SettingOutlined,
    label: t('menu.settings'),
    path: '/settings'
  }
];

const menuItems = ref(getMenuItems());

// 监听语言变化，更新菜单项
watch(
  () => appStore.locale,
  () => {
    menuItems.value = getMenuItems();
  }
);

// 监听路由变化，更新选中的菜单项
watch(
  () => route.path,
  path => {
    const findMenuKey = (items: any[], path: string): string | undefined => {
      for (const item of items) {
        if (item.path === path) return item.key;
        if (item.children) {
          const key = findMenuKey(item.children, path);
          if (key) {
            openKeys.value = [item.key];
            return key;
          }
        }
      }
      return undefined;
    };

    const key = findMenuKey(menuItems.value, path);
    if (key) {
      selectedKeys.value = [key];
    }
  },
  { immediate: true }
);

const handleMenuClick = (key: string) => {
  const findPath = (items: any[]): string | undefined => {
    for (const item of items) {
      if (item.key === key) return item.path;
      if (item.children) {
        const path = findPath(item.children);
        if (path) return path;
      }
    }
    return undefined;
  };

  const path = findPath(menuItems.value);
  if (path) {
    router.push(path);
  }
};
</script>

<template>
  <a-layout style="min-height: 100vh" :class="appStore.theme">
    <a-layout-sider v-model:collapsed="collapsed" collapsible :theme="appStore.theme">
      <div class="logo" :class="appStore.theme" />
      <a-menu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" :theme="appStore.theme" mode="inline"
        @select="({ key }) => handleMenuClick(key as string)">
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
      <a-layout-header :style="headerStyles">
        <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
        <HeaderActions />
      </a-layout-header>
      <TabsView />
      <a-layout-content :style="contentStyles" style="margin: 16px">
        <router-view></router-view>
      </a-layout-content>
      <a-layout-footer :style="footerStyles">Ant Design Vue ©2024 Created by Ant UED</a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.logo.dark {
  background: rgba(255, 255, 255, 0.2);
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

:deep(.ant-layout) {
  transition: all 0.3s;
}

:deep(.ant-layout-sider) {
  transition: all 0.3s;
}

:deep(.ant-layout-header) {
  transition: all 0.3s;
}

:deep(.ant-layout-content) {
  transition: all 0.3s;
}

:deep(.ant-layout-footer) {
  transition: all 0.3s;
}
</style>
