<template>
  <a-table
    :columns="columns"
    :data-source="localFields"
    row-key="randomId"
    :pagination="false"
    bordered
  >
    <template #bodyCell="slotProps">
      <template v-if="slotProps.column.dataIndex === 'label'">
        <TableRow v-bind="slotProps">
          <template #default="rowProps">
            <a-input
              v-if="rowProps?.editingRow?.isEditing"
              v-model:value="rowProps.editingRow.label"
            />
            <template v-else>{{ rowProps.editingRow?.label }}</template>
          </template>
        </TableRow>
      </template>
      <template v-if="slotProps.column.dataIndex === 'field'">
        <TableRow v-bind="slotProps">
          <template #default="{ editingRow }">
            <a-input
              v-if="editingRow?.isEditing"
              v-model:value="editingRow.field"
              placeholder="请输入字段定义"
            />
            <template v-else>{{ editingRow?.field }}</template>
          </template>
        </TableRow>
      </template>

      <template v-if="slotProps.column.dataIndex === 'type'">
        <TableRow v-bind="slotProps">
          <template #default="rowProps">
            <a-select
              v-if="rowProps.editingRow?.isEditing"
              v-model:value="rowProps.editingRow.type"
              placeholder="请选择字段类型"
            >
              <a-select-option value="input">输入框</a-select-option>
              <a-select-option value="textarea">文本域</a-select-option>
              <a-select-option value="select">下拉框</a-select-option>
            </a-select>
            <template v-else>{{ rowProps.editingRow?.type }}</template>
          </template>
        </TableRow>
      </template>
      <template v-if="slotProps.column.dataIndex === 'defaultValue'">
        <TableRow v-bind="slotProps">
          <template #default="rowProps">
            <a-input
              v-if="rowProps.editingRow?.isEditing"
              v-model:value="rowProps.editingRow.defaultValue"
              placeholder="请输入默认值"
            />
            <template v-else>{{ rowProps.editingRow?.defaultValue }}</template>
          </template>
        </TableRow>
      </template>
      <template v-if="slotProps.column.dataIndex === 'required'">
        <TableRow v-bind="slotProps">
          <template #default="rowProps">
            <a-checkbox
              v-if="rowProps.editingRow?.isEditing"
              v-model:checked="rowProps.editingRow.required"
            />
            <template v-else>{{ rowProps.editingRow?.required ? '是' : '否' }}</template>
          </template>
        </TableRow>
      </template>

      <template v-else-if="slotProps.column.dataIndex === 'operation'">
        <div class="editable-row-operations">
          <TableRow v-bind="slotProps">
            <template #default="{ editingRow, isEditing, toggleEdittingHandle }">
              <template v-if="isEditing">
                <a-space>
                  <a @click="applyEditingRow(editingRow)">保存</a>
                  <a
                    @click="
                      () => {
                        removeEditingRow(editingRow);
                        toggleEdittingHandle();
                      }
                    "
                    >取消</a
                  >
                </a-space>
              </template>
              <template v-else>
                <a-space>
                  <a
                    @click="
                      () => {
                        addEditingRow(editingRow);
                        toggleEdittingHandle();
                      }
                    "
                    >编辑</a
                  >
                  <plus-circle-outlined
                    @click="addFieldsHandle(slotProps.index)"
                    class="add-icon"
                  />
                  <minus-circle-outlined
                    @click="removeFieldsHandle(slotProps.index)"
                    class="delete-icon"
                  />
                </a-space>
              </template>
            </template>
          </TableRow>
        </div>
      </template>
    </template>
  </a-table>
  <!-- <div v-for="(field, index) in fields" :key="field.label" class="field-list">
    <a-input v-model:value="field.label" placeholder="请输入字段名称" />
    <a-select v-model:value="field.type" placeholder="请选择字段类型">
      <a-select-option value="input">输入框</a-select-option>
      <a-select-option value="textarea">文本域</a-select-option>
      <a-select-option value="select">下拉框</a-select-option>
    </a-select>
    <a-input v-model:value="field.value" placeholder="请输入默认值" />
    <a-checkbox v-model:value="field.required" />
    <plus-circle-outlined @click="$emit('add', index)" class="add-icon" />
    <minus-circle-outlined
      v-if="fields.length > 1"
      @click="$emit('remove', index)"
      class="delete-icon"
    />
  </div> -->
  <!-- <JSONViewHelper label="自定义属性" :data="localFields" :defualtValue="[]" /> -->
</template>

<script setup lang="ts">
import { computed, ref, watch, type Ref } from 'vue';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons-vue';
import TableRow from './table-row.vue';
// import JSONViewHelper from '@/utils/helper/JSONViewHelper';
import { deepClone, randomString } from '@/utils';

defineOptions({
  name: 'custom-fields',
});

interface Props {
  value: CustomField[];
}
const props = withDefaults(defineProps<Props>(), {
  value: () => [],
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: CustomField): void;
}>();

// const fields = computed<T>({
//   get: () => props.value,
//   set: (value) => {
//     emit('update:modelValue', value);
//   },
// });
const localFields = ref<CustomField[]>(deepClone(props.value));
watch(
  () => props.value,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      localFields.value = newValue;
    }
  },
);
const columns = [
  { title: '字段名称', dataIndex: 'label', width: 200 },
  { title: '字段定义', dataIndex: 'field', width: 200 },
  { title: '类型', dataIndex: 'type', width: 200 },
  { title: '默认值', dataIndex: 'defaultValue', width: 200 },
  { title: '是否必填', dataIndex: 'required', width: 80 },
  { title: '操作', dataIndex: 'operation', width: 100 },
];

const addFieldsHandle = (index: number = localFields.value.length) => {
  const now = Date.now();
  const newField = {
    randomId: randomString(),
    label: `label${index + 1}`,
    field: `key${index + 1}`,
    type: null,
    value: null,
    defaultValue: null,
    required: false,
    createdAt: now,
    updatedAt: now,
    isEditing: true,
  };
  localFields.value.splice(index, 0, newField);
};
const removeFieldsHandle = (index: number) => {
  localFields.value.splice(index, 1);
};

const editRows: Ref<CustomField[]> = ref([]);

const applyEditingRow = (row: CustomField | null) => {
  if (!row) {
    return;
  }
  console.log(row);
};
const removeEditingRow = (row: CustomField | null) => {
  if (!row) {
    return;
  }
  editRows.value = editRows.value.filter((item) => item.randomId !== row.randomId);
};
const addEditingRow = (row: CustomField | null) => {
  if (!row) {
    return;
  }
  editRows.value.push(row);
};

/**
 * 暴露出外层需要的逻辑和方法
 */
defineExpose({
  isEmpty: computed(() => localFields.value.length === 0),
  addFieldsHandle,
});
</script>

<style scoped>
.field-list {
  display: flex;
  column-gap: 4px;
  row-gap: 6px;
}
.add-icon {
  color: green;
}
.delete-icon {
  color: red;
}
</style>
