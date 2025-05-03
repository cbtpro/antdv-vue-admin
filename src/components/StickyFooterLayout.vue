<template>
  <div class="layout" ref="layout">
    <div ref="content" :style="layoutContentCss" class="layout-content">
      <slot />
    </div>
    <div class="layout-footer" :class="footerClass">
      <slot name="footer" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import type { StyleValue } from 'vue';

function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

interface IProps {
  debounceTime?: number;
  layoutContentCss?: StyleValue;
}

defineOptions({
  name: 'CStickyFooterLayout',
});
const props = withDefaults(defineProps<IProps>(), {
  debounceTime: 10,
  layoutContentCss: () => ({
    paddingBottom: '70px',
  }),
});
/*
 * layout - 参考节点，整个布局容器
 */
const layout = ref<HTMLDivElement | null>(null);

/*
 * content - 内容区域的参考节点，观察其变化以决定 footer 位置
 */
const content = ref<HTMLDivElement | null>(null);

/*
 * footerClass - 用于动态控制 footer 的位置（sticky 或 absolute）
 */
const footerClass = ref('');

/*
 * updateFooterPosition - 更新 footer 的位置，检查内容高度与窗口高度的关系
 * 根据内容高度判断是否使用 sticky 或 absolute 样式
 */
const updateFooterPosition = () => {
  if (layout.value && content.value) {
    const contentHeight = content.value.scrollHeight;
    const windowHeight = window.innerHeight;

    /*
     * 如果内容高度小于窗口高度，footer 使用绝对定位
     * 否则使用粘性定位
     */
    if (contentHeight < windowHeight) {
      if (footerClass.value !== 'absolute-footer') {
        footerClass.value = 'absolute-footer';
      }
    } else {
      if (footerClass.value !== 'sticky-footer') {
        footerClass.value = 'sticky-footer';
      }
    }
  }
};

const toggleFooterClassName = debounce((bool: boolean) => {
  if (bool) {
    footerClass.value = 'absolute-footer';
  } else {
    footerClass.value = 'sticky-footer';
  }
}, props.debounceTime);
/*
 * createIntersectionObserver - 创建 IntersectionObserver 实例，监听内容区域的可见性
 * 如果内容区域完全可见，footer 使用 absolute 定位，否则使用 sticky 定位
 */
const observer = ref<IntersectionObserver | null>(null);
const createIntersectionObserver = () => {
  observer.value = new IntersectionObserver(
    ([entry]) => {
      /*
       * 如果内容区域完全可见，将 footer 定位为 absolute
       * 否则定位为 sticky
       */
      toggleFooterClassName(entry.isIntersecting);
    }, // 使用外部传入的去抖动时间
    {
      root: null, // 使用视口作为根元素
      threshold: 1.0, // 观察内容完全可见时触发
    },
  );
  if (content.value) {
    /*
     * 开始观察内容区域
     */
    observer.value.observe(content.value);
  }
};

/*
 * createResizeObserver - 创建 ResizeObserver 实例，监听容器尺寸变化
 * 触发时调用 updateFooterPosition 以调整 footer 位置
 */
const resizeObserver = ref<ResizeObserver | null>(null);
const createResizeObserver = () => {
  resizeObserver.value = new ResizeObserver(
    debounce(() => {
      /*
       * 在尺寸变化时更新 footer 位置
       */
      updateFooterPosition();
    }, props.debounceTime),
  ); // 使用外部传入的去抖动时间

  if (layout.value) {
    /*
     * 开始观察容器尺寸变化
     */
    resizeObserver.value.observe(layout.value);
  }
};

onMounted(() => {
  nextTick(() => {
    /*
     * 组件挂载完成后，初始化 footer 位置
     */
    updateFooterPosition(); // 初始化时更新 footer 位置
    createIntersectionObserver(); // 启动 IntersectionObserver
    createResizeObserver(); // 启动 ResizeObserver
  });
});

onBeforeUnmount(() => {
  /*
   * 在组件销毁时，清理所有的观察器和定时器，避免内存泄漏
   */
  // 清理 IntersectionObserver
  if (observer.value) {
    observer.value.disconnect();
  }

  // 清理 ResizeObserver
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }

  /*
   * 清除 DOM 引用，避免内存泄漏
   */
  layout.value = null;
  content.value = null;
});
</script>

<style scoped>
.layout {
  position: relative;
  width: 100%;
  height: 100%;
}

.layout-content {
  /* 内容区域 */
  background-color: transparent;
}

.layout-footer {
  width: 100%;
  bottom: 0;
  left: 0;
  /* display: flex; */
  /* align-items: center; */
  justify-content: center;
  z-index: 100;
}

.layout-footer.absolute-footer {
  position: absolute;
  bottom: 0;
}

.layout-footer.sticky-footer {
  position: sticky;
  bottom: 0;
}
</style>
