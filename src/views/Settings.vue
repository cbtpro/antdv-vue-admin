<script setup lang="ts">
import { useTabStore } from '@/stores/tabs';

const tabStore = useTabStore();

const handleSettingChange = () => {
  tabStore.saveSettings();
};
</script>

<template>
  <div class="settings-container">
    <a-card title="系统设置">
      <a-form layout="vertical">
        <a-form-item label="标签页设置">
          <a-checkbox v-model:checked="tabStore.settings.restoreTabs" @change="handleSettingChange">
            重新打开页面时恢复上次打开的标签页
          </a-checkbox>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<style scoped>
.settings-container {
  padding: 24px;
  background: #f0f2f5;
  min-height: 100%;
}
</style>
