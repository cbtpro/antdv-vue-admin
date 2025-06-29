<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Component } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Menu as AMenu } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import {
  HomeOutlined,
  FormOutlined,
  InfoCircleOutlined,
  RobotOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons-vue';
import Tabs from '@/components/Tabs.vue';
import HeaderActions from '@/components/HeaderActions.vue';
import KeepAliveTabsViewer from '@/components/KeepAliveTabsViewer.vue';
import { useAppStore } from '@/stores/app';
// import { SelectInfo } from 'ant-design-vue/es/menu/src/interface';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['home']);
const openKeys = ref<string[]>(['practices']);

const headerStyles = computed(() => ({
  background: appStore.theme === 'dark' ? '#1f1f1f' : '#fff',
  color: appStore.theme === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.85)',
  borderBottom: `1px solid ${appStore.theme === 'dark' ? '#303030' : '#f0f0f0'}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

interface IMenuItem {
  key: string;
  icon?: Component;
  label: string;
  path?: string;
  children?: IMenuItem[];
}

const defualtMenus: IMenuItem[] = [
  {
    key: 'home',
    icon: HomeOutlined,
    label: t('menu.home'),
    path: '/',
  },
  {
    key: 'practices',
    icon: FormOutlined,
    label: t('menu.practices'),
    children: [
      {
        key: 'related-form',
        label: t('menu.related-form'),
        path: '/practices/related-form',
      },
      // {
      //   key: 'dynamic-form',
      //   label: t('menu.dynamic-form'),
      //   path: '/practices/dynamic-form'
      // },
      // {
      //   key: 'step-form',
      //   label: t('menu.stepForm'),
      //   path: '/practices/step-form'
      // },
      {
        key: 'form',
        label: t('menu.form'),
        path: '/practices/form',
      },
      {
        key: 'base-form',
        label: '基础表单',
        path: '/practices/basic',
      },
      {
        key: 'dynamic-form1',
        label: '动态表单',
        path: '/practices/dynamic',
      },
      {
        key: 'multi-step',
        label: '多步骤表单',
        path: '/practices/multi-step',
      },
      {
        key: 'search',
        label: '搜索表单',
        path: '/practices/search',
      },
      {
        key: 'advanced-filter',
        label: '高级筛选',
        path: '/practices/advanced-filter',
      },
      {
        key: 'complex-filter',
        label: '复杂搜索表单',
        path: '/practices/complex-filter',
      },

      {
        key: 'table',
        label: '表格表单',
        path: '/practices/table',
      },
      {
        key: 'custom',
        label: '自定义表单',
        path: '/practices/custom',
      },
      {
        key: 'useForm',
        label: 'useForm',
        path: '/practices/use-form',
      },
    ],
  },
  {
    key: 'ai-client',
    icon: RobotOutlined,
    label: t('menu.aiClient'),
    path: '/ai-client',
  },
  {
    key: 'about',
    icon: InfoCircleOutlined,
    label: t('menu.about'),
    path: '/about',
  },
  {
    key: 'settings',
    icon: SettingOutlined,
    label: t('menu.settings'),
    path: '/settings',
  },
];

const menuItems = ref([...defualtMenus]);

// 监听语言变化，更新菜单项
watch(
  () => appStore.locale,
  () => {
    menuItems.value = [...defualtMenus];
  },
);

const flashTimer = ref<number | null>(null);
const flashMenu = (key: string) => {
  openKeys.value = [key];
  if (!collapsed.value) {
    return;
  }
  if (flashTimer.value) {
    window.clearTimeout(flashTimer.value);
  }
  flashTimer.value = window.setTimeout(() => {
    openKeys.value = [];
  }, 800);
};
// 监听路由变化，更新选中的菜单项
watch(
  () => route.path,
  (path) => {
    const findMenuKey = (items: IMenuItem[], path: string): string | undefined => {
      for (const item of items) {
        if (item.path === path) return item.key;
        if (item.children) {
          const key = findMenuKey(item.children, path);
          if (key) {
            flashMenu(item.key);
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
  { immediate: true },
);

const handleMenuClick = (key: string) => {
  const findPath = (items: IMenuItem[]): string | undefined => {
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
  <a-layout style="height: 100vh" :class="appStore.theme">
    <a-layout-sider v-model:collapsed="collapsed" collapsible :theme="appStore.theme">
      <div class="logo" :class="appStore.theme" />
      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        :theme="appStore.theme"
        mode="inline"
        @select="({ key }) => handleMenuClick(key as string)"
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
      <a-layout-header :style="headerStyles" class="header">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
        <HeaderActions />
      </a-layout-header>
      <Tabs />
      <a-layout-content style="overflow: auto">
        <!-- <router-view></router-view> -->
        <KeepAliveTabsViewer />
      </a-layout-content>
      <a-layout-footer>Ant Design Vue ©2024 Created by Ant UED</a-layout-footer>
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

.header {
  padding-inline: 0;
}
</style>
