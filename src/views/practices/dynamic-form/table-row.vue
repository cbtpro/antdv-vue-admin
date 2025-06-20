<template>
  <slot
    :editingRow="editingRow"
    :isEditing="isEditing"
    :toggleEdittingHandle="toggleEdittingHandle"
  ></slot>
</template>

<script setup lang="ts" generic="T extends CustomField">
import type { ColumnType } from 'ant-design-vue/es/table/interface';
import { computed, ref } from 'vue';

defineOptions({ name: 'TableRow' });

interface IProps {
  text: T;
  record: T;
  index: number;
  column: ColumnType<T>;
}

const props = withDefaults(defineProps<IProps>(), {});
const editingRow = ref<T | null>(props.record);
const isEditing = computed(() => !!editingRow.value?.isEditing);
const toggleEdittingHandle = () => {
  editingRow.value.isEditing = !editingRow.value.isEditing;
};
</script>

<style scoped></style>
