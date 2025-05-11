import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { RouteLocationNormalized } from 'vue-router';

export interface TabItem {
  key: string;
  title: string;
  path: string;
  closable: boolean;
  fixed: boolean;
}

export const useTabStore = defineStore('tabs', () => {
  const tabs = ref<TabItem[]>([
    { key: 'home', title: '首页', path: '/', closable: false, fixed: false }
  ]);
  const activeTab = ref('home');
  const settings = ref({
    restoreTabs: true
  });

  const addTab = (route: RouteLocationNormalized) => {
    const { name, path, meta = {} } = route;
    if (!name) return;

    const key = name as string;
    const title = meta?.title as string ?? '未知标题';
    if (!tabs.value.some(tab => tab.key === key)) {
      tabs.value.push({
        key,
        title,
        path,
        closable: key !== 'home',
        fixed: false
      });
    }
    activeTab.value = key;
  };

  const removeTab = (key: string) => {
    const index = tabs.value.findIndex(tab => tab.key === key);
    if (index === -1) return;

    if (activeTab.value === key) {
      activeTab.value = tabs.value[index - 1]?.key || tabs.value[index + 1]?.key;
    }
    tabs.value = tabs.value.filter(tab => tab.key !== key);
  };

  const removeOtherTabs = (key: string) => {
    tabs.value = tabs.value.filter(tab => tab.key === key || !tab.closable);
    activeTab.value = key;
  };

  const removeRightTabs = (key: string) => {
    const index = tabs.value.findIndex(tab => tab.key === key);
    if (index === -1) return;

    tabs.value = tabs.value.filter((tab, i) => i <= index || !tab.closable);
    if (!tabs.value.some(tab => tab.key === activeTab.value)) {
      activeTab.value = key;
    }
  };

  const removeLeftTabs = (key: string) => {
    const index = tabs.value.findIndex(tab => tab.key === key);
    if (index === -1) return;

    tabs.value = tabs.value.filter((tab, i) => i >= index || !tab.closable);
    if (!tabs.value.some(tab => tab.key === activeTab.value)) {
      activeTab.value = key;
    }
  };

  const removeAllTabs = () => {
    tabs.value = tabs.value.filter(tab => !tab.closable);
    activeTab.value = 'home';
  };

  const toggleFixed = (key: string) => {
    const tab = tabs.value.find(tab => tab.key === key);
    if (tab) {
      tab.fixed = !tab.fixed;
      tab.closable = !tab.fixed;
    }
  };

  // 持久化标签页状态
  const saveTabs = () => {
    if (settings.value.restoreTabs) {
      localStorage.setItem('tabs', JSON.stringify(tabs.value));
      localStorage.setItem('activeTab', activeTab.value);
    }
  };

  const restoreTabs = () => {
    if (settings.value.restoreTabs) {
      const savedTabs = localStorage.getItem('tabs');
      const savedActiveTab = localStorage.getItem('activeTab');
      if (savedTabs) {
        tabs.value = JSON.parse(savedTabs);
      }
      if (savedActiveTab) {
        activeTab.value = savedActiveTab;
      }
    }
  };

  // 保存设置
  const saveSettings = () => {
    localStorage.setItem('tabSettings', JSON.stringify(settings.value));
  };

  const restoreSettings = () => {
    const savedSettings = localStorage.getItem('tabSettings');
    if (savedSettings) {
      settings.value = JSON.parse(savedSettings);
    }
  };

  return {
    tabs,
    activeTab,
    settings,
    addTab,
    removeTab,
    removeOtherTabs,
    removeRightTabs,
    removeLeftTabs,
    removeAllTabs,
    toggleFixed,
    saveTabs,
    restoreTabs,
    saveSettings,
    restoreSettings
  };
});
