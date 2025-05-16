<template>
  <a-card title="复杂筛选表单">
    <a-form :model="formState" @finish="onFinish" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item label="名称" name="name">
            <a-input v-model:value="formState.name" placeholder="请输入名称" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="类型" name="type">
            <a-select v-model:value="formState.type" placeholder="请选择类型">
              <a-select-option value="type1">类型一</a-select-option>
              <a-select-option value="type2">类型二</a-select-option>
              <a-select-option value="type3">类型三</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="状态" name="status">
            <a-select v-model:value="formState.status" placeholder="请选择状态">
              <a-select-option value="active">活跃</a-select-option>
              <a-select-option value="inactive">不活跃</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item label="日期范围" name="dateRange">
            <a-range-picker v-model:value="formState.dateRange" class="w-full" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="标签" name="tags">
            <a-select v-model:value="formState.tags" mode="multiple" placeholder="请选择标签">
              <a-select-option value="tag1">标签一</a-select-option>
              <a-select-option value="tag2">标签二</a-select-option>
              <a-select-option value="tag3">标签三</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="排序" name="sort">
            <a-select v-model:value="formState.sort" placeholder="请选择排序方式">
              <a-select-option value="asc">升序</a-select-option>
              <a-select-option value="desc">降序</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="24" class="text-right">
          <a-space>
            <a-button @click="resetForm">重置</a-button>
            <a-button type="primary" html-type="submit">查询</a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-form>

    <a-divider />

    <div class="table-operations mb-4">
      <a-space>
        <a-button @click="showColumnSettings">
          <template #icon><setting-outlined /></template>
          列设置
        </a-button>
        <a-button @click="handleBatchDelete" :disabled="!selectedRowKeys.length">
          <template #icon><delete-outlined /></template>
          批量删除
        </a-button>
        <a-button @click="handleExport" :disabled="!dataSource.length">
          <template #icon><download-outlined /></template>
          导出数据
        </a-button>
      </a-space>
    </div>

    <a-table
      :columns="visibleColumns"
      :data-source="dataSource"
      :row-selection="rowSelection"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      bordered
    >
      <!-- <template #headerCell="{ column }">
        <template v-if="column.key === 'drag'">
          <a-tooltip title="拖拽排序">
            <drag-outlined />
          </a-tooltip>
        </template>
        <template v-else>
          {{ column.title }}
          <template v-if="column.sorter">
            <caret-up-outlined :class="{ active: column.sortOrder === 'ascend' }" />
            <caret-down-outlined :class="{ active: column.sortOrder === 'descend' }" />
          </template>
        </template>
      </template> -->

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'tags'">
          <a-space>
            <a-tag v-for="tag in record.tags" :key="tag" :color="getTagColor(tag)">
              {{ tag }}
            </a-tag>
          </a-space>
        </template>
        <template v-else-if="column.key === 'status'">
          <a-tag :color="record.status === 'active' ? 'success' : 'error'">
            {{ record.status === 'active' ? '活跃' : '不活跃' }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定要删除吗？" @confirm="handleDelete(record)">
              <a class="text-red-500">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal v-model:visible="columnSettingsVisible" title="列设置" @ok="saveColumnSettings">
      <a-checkbox-group v-model:value="selectedColumns">
        <div v-for="col in allColumns" :key="col.key" class="mb-2">
          <a-checkbox :value="col.key">{{ col.title }}</a-checkbox>
        </div>
      </a-checkbox-group>
    </a-modal>

    <a-modal v-model:visible="editModalVisible" title="编辑记录" @ok="handleEditSubmit">
      <a-form :model="editForm" layout="vertical">
        <a-form-item label="名称" name="name">
          <a-input v-model:value="editForm.name" />
        </a-form-item>
        <a-form-item label="类型" name="type">
          <a-select v-model:value="editForm.type">
            <a-select-option value="type1">类型一</a-select-option>
            <a-select-option value="type2">类型二</a-select-option>
            <a-select-option value="type3">类型三</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-select v-model:value="editForm.status">
            <a-select-option value="active">活跃</a-select-option>
            <a-select-option value="inactive">不活跃</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="标签" name="tags">
          <a-select v-model:value="editForm.tags" mode="multiple">
            <a-select-option value="tag1">标签一</a-select-option>
            <a-select-option value="tag2">标签二</a-select-option>
            <a-select-option value="tag3">标签三</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import {
  SettingOutlined,
  DeleteOutlined,
  DownloadOutlined,
  // DragOutlined,
} from '@ant-design/icons-vue';

interface ISearchFormState {
  name: string;
  type: string | null;
  status: string | null;
  dateRange: [string | null, string | null];
  tags: string[];
  sort: string | null;
}
interface IEditRowFormState {
  key: string;
  name: string;
  type: string;
  status: string;
  tags: string[];
}
const formState = reactive<ISearchFormState>({
  name: '',
  type: null,
  status: null,
  dateRange: [null, null],
  tags: [],
  sort: null,
});

const loading = ref(false);
const columnSettingsVisible = ref(false);
const editModalVisible = ref(false);
const selectedRowKeys = ref<string[]>([]);
const selectedColumns = ref(['name', 'type', 'status', 'tags', 'action']);

const editForm = reactive<IEditRowFormState>({
  key: '',
  name: '',
  type: '',
  status: '',
  tags: [],
});

const allColumns = [
  { title: '名称', dataIndex: 'name', key: 'name', sorter: true },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    filters: [
      { text: '类型一', value: 'type1' },
      { text: '类型二', value: 'type2' },
      { text: '类型三', value: 'type3' },
    ],
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    filters: [
      { text: '活跃', value: 'active' },
      { text: '不活跃', value: 'inactive' },
    ],
  },
  { title: '标签', dataIndex: 'tags', key: 'tags' },
  { title: '操作', key: 'action', width: 150, fixed: 'right' },
];

const visibleColumns = computed(() => {
  return allColumns.filter((col) => selectedColumns.value.includes(col.key));
});

const dataSource = ref([
  {
    key: '1',
    name: '示例数据1',
    type: 'type1',
    status: 'active',
    tags: ['tag1', 'tag2'],
  },
  {
    key: '2',
    name: '示例数据2',
    type: 'type2',
    status: 'inactive',
    tags: ['tag3'],
  },
]);

const pagination = reactive({
  total: 100,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`,
});

const rowSelection = {
  selectedRowKeys,
  onChange: (keys: string[]) => {
    selectedRowKeys.value = keys;
  },
};

const tagColors: {
  [key: string]: string;
} = {
  tag1: 'blue',
  tag2: 'green',
  tag3: 'orange',
};

const getTagColor = (tag: string) => {
  return tagColors[tag] || 'default';
};

const onFinish = (values: ISearchFormState) => {
  console.log('查询条件:', values);
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    message.success('查询成功！');
  }, 1000);
};

const resetForm = () => {
  formState.name = '';
  formState.type = null;
  formState.status = null;
  formState.dateRange = [null, null];
  formState.tags = [];
  formState.sort = null;
};

const showColumnSettings = () => {
  columnSettingsVisible.value = true;
};

const saveColumnSettings = () => {
  columnSettingsVisible.value = false;
  message.success('列设置已保存');
};

interface ITableChangeParams {
  pagination: {
    current: number;
    pageSize: number;
    showQuickJumper: boolean;
    showSizeChanger: boolean;
    total: number;
  };
  filters: {
    [key: string]: string[] | null;
  };
  sorter: {
    field: string;
    order: string;
  };
}
const handleTableChange = (pagination: ITableChangeParams['pagination'], filters, sorter) => {
  debugger;
  console.log('page:', pagination);
  console.log('filters:', filters);
  console.log('sorter:', sorter);
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

const handleEdit = (record: IEditRowFormState) => {
  Object.assign(editForm, record);
  editModalVisible.value = true;
};

const handleEditSubmit = () => {
  const index = dataSource.value.findIndex((item) => item.key === editForm.key);
  if (index > -1) {
    dataSource.value[index] = { ...editForm };
    message.success('编辑成功');
    editModalVisible.value = false;
  }
};

const handleDelete = (record: IEditRowFormState) => {
  dataSource.value = dataSource.value.filter((item) => item.key !== record.key);
  message.success('删除成功');
};

const handleBatchDelete = () => {
  dataSource.value = dataSource.value.filter((item) => !selectedRowKeys.value.includes(item.key));
  selectedRowKeys.value = [];
  message.success('批量删除成功');
};

const handleExport = () => {
  message.success('数据导出成功');
};
</script>

<style scoped>
.w-full {
  width: 100%;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.text-right {
  text-align: right;
}

.text-red-500 {
  color: #ef4444;
}

:deep(.ant-table-column-sorter) {
  margin-left: 4px;
}

:deep(.active) {
  color: #1890ff;
}
</style>
