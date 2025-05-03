<script setup lang="ts">
import { computed } from 'vue';
import { RouterView } from 'vue-router';
import { theme } from 'ant-design-vue';

const antdThemeConfig = computed(() => {
  return {
    token: {
      // colorPrimary: '#00b96b',
      algorithm: theme.darkAlgorithm,
    },
  };
});
</script>

<template>
  <a-config-provider :theme="antdThemeConfig">
    <router-view></router-view>
  </a-config-provider>
</template>
