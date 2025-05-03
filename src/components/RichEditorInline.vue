<template>
  <div class="rich-editor-inline">
    <a-drawer :width="500" :title="title" :placement="placement" :open="open" @close="onClose">
      <template #extra>
        <a-button type="primary" @click="onClose">关闭</a-button>
      </template>

      <RichEditor v-model:value="localModel" :placeholder="placeholder" />
    </a-drawer>
    <div @click="showDrawer" class="echo">{{ value }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import RichEditor from './RichEditor.vue';
import type { DrawerProps } from 'ant-design-vue';

interface IProps {
  value?: string;
  placeholder?: string;
  title?: string;
  placement?: DrawerProps['placement'];
}

defineOptions({
  name: 'RichEditorInline',
});

const props = withDefaults(defineProps<IProps>(), {
  value: '',
  placeholder: '请输入内容',
  title: '标题',
  placement: 'right',
});

const emits = defineEmits<{
  (e: 'update:value', value: string): void;
}>();
const localModel = computed({
  get: () => props.value,
  set: (val) => emits('update:value', val)
});
const placement = ref<DrawerProps['placement']>('right');
const open = ref<boolean>(false);

const showDrawer = () => {
  open.value = true;
};

const onClose = () => {
  open.value = false;
};
</script>

<style lang="less" scoped>
.rich-editor-inline {
  .echo {
    cursor: pointer;
  }
}
</style>
