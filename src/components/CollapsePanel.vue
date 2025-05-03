<template>
  <div class="collapse-panel">
    <!-- 切换按钮插槽 -->
    <slot name="toggle" :expanded="expanded" :toggle="toggle" />
    <!-- 动画容器 -->
    <div ref="wrapperRef" class="collapse-wrapper" :style="wrapperStyle">
      <div ref="innerRef" class="inner">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';

defineOptions({
  name: 'CollapsePanel',
});
const props = defineProps<{
  expanded?: boolean;
  minHeight?: number;
  duration?: number;
}>();
const emit = defineEmits<{
  (e: 'update:expanded', val: boolean): void;
}>();

const expanded = ref(props.expanded ?? false);
const minHeight = props.minHeight ?? 62;
const duration = props.duration ?? 300;

const wrapperRef = ref<HTMLElement | null>(null);
const innerRef = ref<HTMLElement | null>(null);
const animating = ref(false);
const currentHeight = ref(minHeight);

// 计算动态 style
const wrapperStyle = computed(() => ({
  height: `${currentHeight.value}px`,
  overflow: 'hidden',
  transition: animating.value ? `height ${duration}ms cubic-bezier(0.25, 0.8, 0.25, 1)` : 'none',
}));

const toggle = () => {
  emit('update:expanded', !expanded.value);
};

const doAnimate = async (expand: boolean) => {
  await nextTick();
  const el = wrapperRef.value;
  const inner = innerRef.value;
  if (!el || !inner) return;

  const start = el.offsetHeight;
  const end = expand ? inner.scrollHeight : minHeight;

  // 启动动画
  animating.value = true;
  currentHeight.value = start;

  // 强制重新渲染一次，触发 transition
  void el.offsetHeight;

  // 改变目标高度
  currentHeight.value = end;

  // 动画完成后还原高度样式（展开时恢复 auto）
  setTimeout(() => {
    animating.value = false;
    if (expand) {
      currentHeight.value = inner.scrollHeight;
      // 小 trick：让浏览器再次触发绘制
      nextTick(() => {
        currentHeight.value = inner.offsetHeight;
      });
    }
  }, duration);
};

watch(
  () => props.expanded,
  val => {
    expanded.value = val;
    doAnimate(val);
  },
);

onMounted(() => {
  currentHeight.value = props.expanded ? innerRef.value?.scrollHeight ?? minHeight : minHeight;
});
</script>

<style scoped>
.collapse-panel {
  position: relative;
}

.collapse-wrapper {
  will-change: height;
}

.inner {
  padding: 0;
}
</style>
