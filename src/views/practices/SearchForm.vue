<template>
  <a-card title="搜索表单">
    <a-form :model="formState" layout="vertical" @finish="onSearch">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item label="关键词搜索" name="keyword">
            <a-input v-model:value="formState.keyword" placeholder="请输入关键词" allow-clear>
              <template #prefix>
                <search-outlined />
              </template>
            </a-input>
          </a-form-item>
        </a-col>

        <a-col :span="8">
          <a-form-item label="分类" name="category">
            <a-select v-model:value="formState.category" placeholder="请选择分类" allow-clear>
              <a-select-option value="tech">技术</a-select-option>
              <a-select-option value="design">设计</a-select-option>
              <a-select-option value="business">商务</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="8">
          <a-form-item label="时间范围" name="dateRange">
            <a-range-picker v-model:value="formState.dateRange" style="width: 100%" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="24" style="text-align: right">
          <a-space>
            <a-button @click="resetForm">重置</a-button>
            <a-button type="primary" html-type="submit">搜索</a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-form>

    <a-divider />

    <a-table :columns="columns" :data-source="searchResults" :loading="loading" />
  </a-card>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

defineOptions({
  name: 'SearchForm',
});

const formState = reactive({
  keyword: '',
  category: undefined,
  dateRange: [],
});

const loading = ref(false);
const searchResults = ref([
  {
    key: '1',
    title: '示例文章1',
    category: '技术',
    date: '2025-01-01',
    views: 100,
  },
  {
    key: '2',
    title: '示例文章2',
    category: '设计',
    date: '2025-01-02',
    views: 200,
  },
]);

const columns = [
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '分类',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: '发布日期',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '浏览量',
    dataIndex: 'views',
    key: 'views',
  },
];

const onSearch = () => {
  loading.value = true;
  // 模拟搜索请求
  setTimeout(() => {
    loading.value = false;
    message.success('搜索完成！');
    console.log('搜索条件：', formState);
  }, 1000);
};

const resetForm = () => {
  formState.keyword = '';
  formState.category = undefined;
  formState.dateRange = [];
};
</script>
