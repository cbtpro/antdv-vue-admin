<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { useI18n } from 'vue-i18n';
import {
  TranslationOutlined,
  BulbOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue';

const router = useRouter();
const appStore = useAppStore();
const { t, locale } = useI18n();

const currentUser = {
  name: 'Admin',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
};

const localeLabel = computed(() => {
  return appStore.locale === 'zh' ? 'English' : '中文';
});

const handleLocaleChange = () => {
  const newLocale = appStore.locale === 'zh' ? 'en' : 'zh';
  appStore.setLocale(newLocale);
  locale.value = newLocale;
};

const handleThemeChange = () => {
  appStore.toggleTheme();
};

const handleSettingsClick = () => {
  router.push('/settings');
};

const handleLogout = () => {
  // 实现登出逻辑
  console.log('logout');
};
</script>

<template>
  <div class="header-actions">
    <a-space :size="16">
      <a-button type="text" @click="handleLocaleChange">
        <template #icon><translation-outlined /></template>
        {{ localeLabel }}
      </a-button>

      <a-button type="text" @click="handleThemeChange">
        <template #icon><bulb-outlined /></template>
        {{ t('header.theme.' + appStore.theme) }}
      </a-button>

      <a-dropdown>
        <a-space>
          <a-avatar :src="currentUser.avatar" />
          <span>{{ currentUser.name }}</span>
        </a-space>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="handleSettingsClick">
              <template #icon><setting-outlined /></template>
              {{ t('header.profile.settings') }}
            </a-menu-item>
            <a-menu-item @click="handleLogout">
              <template #icon><logout-outlined /></template>
              {{ t('header.profile.logout') }}
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </a-space>
  </div>
</template>

<style scoped>
.header-actions {
  float: right;
  margin-right: 24px;
}
</style>
