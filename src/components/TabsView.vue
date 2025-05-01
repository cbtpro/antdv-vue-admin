<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTabStore } from '@/stores/tabs';
import { useAppStore } from '@/stores/app';
import { PushpinOutlined } from '@ant-design/icons-vue';
import type { TabItem } from '@/stores/tabs';

const router = useRouter();
const route = useRoute();
const tabStore = useTabStore();
const appStore = useAppStore();

const contextMenuVisible = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });
const currentContextTab = ref<string>('');
const currentTab = ref<TabItem | null>(null);

// 主题相关样式
const tabsContainerStyle = computed(() => ({
  background: appStore.theme === 'dark' ? '#1f1f1f' : '#fff',
  borderBottom: `1px solid ${appStore.theme === 'dark' ? '#303030' : '#f0f0f0'}`
}));

const contextMenuStyle = computed(() => ({
  background: appStore.theme === 'dark' ? '#1f1f1f' : '#fff',
  boxShadow: appStore.theme === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.45)' : '0 2px 8px rgba(0, 0, 0, 0.15)',
  border: `1px solid ${appStore.theme === 'dark' ? '#303030' : '#f0f0f0'}`
}));

// 监听路由变化,添加标签页
watch(
  () => route.name,
  () => {
    if (route.name) {
      tabStore.addTab(route);
    }
  },
  { immediate: true }
);

// 处理标签页点击
const handleTabClick = (key: string) => {
  const tab = tabStore.tabs.find(tab => tab.key === key);
  if (tab) {
    router.push(tab.path);
  }
};

// 处理标签页关闭
const handleTabClose = (key: string) => {
  tabStore.removeTab(key);
  // 如果关闭的是当前标签页,需要跳转到其他标签页
  if (route.name === key) {
    const activeTab = tabStore.tabs.find(tab => tab.key === tabStore.activeTab);
    if (activeTab) {
      router.push(activeTab.path);
    }
  }
};

const handleTabEdit = (targetKey: string, action: string) => {
  if (action === 'remove') {
    handleTabClose(targetKey as string);
  }
};

// 右键菜单相关
const showContextMenu = (e: MouseEvent, tab: TabItem) => {
  e.preventDefault();
  e.stopPropagation();
  contextMenuVisible.value = true;
  contextMenuPosition.value = {
    x: e.clientX,
    y: e.clientY
  };
  currentContextTab.value = tab.key;
  currentTab.value = tab;
};

const hideContextMenu = () => {
  contextMenuVisible.value = false;
};

// 处理右键菜单项点击
const handleContextMenuClick = (action: string) => {
  switch (action) {
    case 'closeAll':
      tabStore.removeAllTabs();
      break;
    case 'closeOthers':
      tabStore.removeOtherTabs(currentContextTab.value);
      break;
    case 'closeRight':
      tabStore.removeRightTabs(currentContextTab.value);
      break;
    case 'closeLeft':
      tabStore.removeLeftTabs(currentContextTab.value);
      break;
    case 'pin':
    case 'unpin':
      tabStore.toggleFixed(currentContextTab.value);
      break;
  }
  hideContextMenu();
};

// 点击其他区域时隐藏右键菜单
const handleClickOutside = (e: MouseEvent) => {
  const contextMenu = document.querySelector('.context-menu');
  if (contextMenu && !contextMenu.contains(e.target as Node)) {
    hideContextMenu();
  }
};

// 阻止整个标签页容器的右键菜单
const preventContextMenu = (e: MouseEvent) => {
  e.preventDefault();
};

// 在组件挂载时添加事件监听
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  // 恢复标签页状态
  tabStore.restoreTabs();
});

// 在组件卸载前移除事件监听
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  // 保存标签页状态
  tabStore.saveTabs();
});
</script>

<template>
  <div class="tabs-view-container" :class="appStore.theme" :style="tabsContainerStyle"
    @contextmenu="preventContextMenu">
    <a-tabs v-model:activeKey="tabStore.activeTab" type="editable-card" hide-add @tabClick="handleTabClick"
      @edit="handleTabEdit">
      <a-tab-pane v-for="tab in tabStore.tabs" :key="tab.key" :closable="!tab.fixed">
        <template #tab>
          <div class="tab-label" @contextmenu.prevent.stop="e => showContextMenu(e, tab)">
            {{ tab.title }}
            <PushpinOutlined v-if="tab.fixed" />
          </div>
        </template>
      </a-tab-pane>
    </a-tabs>

    <!-- 右键菜单 -->
    <div v-if="contextMenuVisible" class="context-menu" :style="{
      left: `${contextMenuPosition.x}px`,
      top: `${contextMenuPosition.y}px`,
      ...contextMenuStyle
    }">
      <a-menu :theme="appStore.theme">
        <a-menu-item @click="handleContextMenuClick('closeAll')">关闭所有</a-menu-item>
        <a-menu-item @click="handleContextMenuClick('closeOthers')">关闭其他</a-menu-item>
        <a-menu-item @click="handleContextMenuClick('closeRight')">关闭右侧</a-menu-item>
        <a-menu-item @click="handleContextMenuClick('closeLeft')">关闭左侧</a-menu-item>
        <a-menu-item @click="handleContextMenuClick(currentTab?.fixed ? 'unpin' : 'pin')">
          {{ currentTab?.fixed ? '取消锚定' : '锚定' }}
        </a-menu-item>
      </a-menu>
    </div>
  </div>
</template>

<style scoped>
.tabs-view-container {
  position: relative;
  padding: 8px 16px;
  transition: all 0.3s;
}

.tab-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  user-select: none;
}

.context-menu {
  position: fixed;
  z-index: 1000;
  border-radius: 4px;
  transition: all 0.3s;
}

:deep(.ant-tabs-tab) {
  transition: all 0.3s;
}

:deep(.ant-tabs-tab.ant-tabs-tab-active) {
  font-weight: 500;
}

:deep(.ant-tabs-nav) {
  margin-bottom: 0;
}

/* 深色主题特定样式 */
.dark :deep(.ant-tabs-tab) {
  border-color: #303030;
  background: #1f1f1f;
  color: rgba(255, 255, 255, 0.85);
}

.dark :deep(.ant-tabs-tab:hover) {
  color: #1890ff;
}

.dark :deep(.ant-tabs-tab-active) {
  background: #141414 !important;
  border-color: #303030 !important;
}

.dark :deep(.ant-tabs-nav) {
  border-color: #303030;
}

.dark :deep(.ant-tabs-nav::before) {
  border-bottom-color: #303030;
}
</style>
