<template>
  <a-card title="高级筛选表单">
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
            <a-range-picker v-model:value="formState.dateRange" style="width: 100%" />
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
        <a-col :span="24" style="text-align: right">
          <a-space>
            <a-button @click="resetForm">重置</a-button>
            <a-button type="primary" html-type="submit">查询</a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-form>

    <a-divider />

    <a-table :columns="columns" :data-source="dataSource" />
  </a-card>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { message } from 'ant-design-vue';

const formState = reactive({
  name: '',
  type: undefined,
  status: undefined,
  dateRange: [],
  tags: [],
  sort: undefined,
});

interface IDataSource {
  key: string;
  name: string;
  type: string;
  status: string;
  tags: string[];
}
const columns = [
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '类型', dataIndex: 'type', key: 'type' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '标签', dataIndex: 'tags', key: 'tags' },
];

const dataSource = ref<IDataSource[]>([
  {
    key: '1',
    name: '示例数据1',
    type: '类型一',
    status: '活跃',
    tags: ['标签一', '标签二'],
  },
  {
    key: '2',
    name: '示例数据2',
    type: '类型二',
    status: '不活跃',
    tags: ['标签三'],
  },
]);

const onFinish = (values: IDataSource) => {
  console.log('筛选条件:', values);
  message.success('查询成功！');
};

const resetForm = () => {
  formState.name = '';
  formState.type = undefined;
  formState.status = undefined;
  formState.dateRange = [];
  formState.tags = [];
  formState.sort = undefined;
};
</script>
