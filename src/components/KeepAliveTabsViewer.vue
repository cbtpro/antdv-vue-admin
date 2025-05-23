<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup lang="ts">
import { ref, computed, watch, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { useTabStore } from '@/stores/tabs';
import type { TabItem } from '@/stores/tabs';

const route = useRoute();

const tabStore = useTabStore();

const { tabs } = toRefs(tabStore);

// 存储需要缓存的组件名称
const cachedComponentNames = ref<Set<string>>(new Set());

// 当前组件的唯一键
const currentKey = computed(() => {
  const { path, query, meta } = route;
  // 将 query 和 meta 转换为 JSON 字符串，并进行排序，以确保键的唯一性
  const queryString = JSON.stringify(Object.fromEntries(Object.entries(query).sort()));
  const metaString = JSON.stringify(Object.fromEntries(Object.entries(meta).sort()));
  return `${path}?query=${queryString}&meta=${metaString}`;
});

// 监听路由变化，更新缓存组件名称
watch(
  () => route,
  (route) => {
    const { meta, name } = route;
    if (meta.isKeepAlive) {
      cachedComponentNames.value.add(name as string);
    } else {
      cachedComponentNames.value.delete(name as string);
    }
  },
  { immediate: true },
);
</script>
