<template>
  <a-card title="表格表单">
    <a-table :columns="columns" :data-source="dataSource" :pagination="false" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <a-input v-if="editingKey === record.key" v-model:value="editingRow.name" />
          <template v-else>{{ record.name }}</template>
        </template>

        <template v-else-if="column.dataIndex === 'age'">
          <a-input-number v-if="editingKey === record.key" v-model:value="editingRow.age" />
          <template v-else>{{ record.age }}</template>
        </template>

        <template v-else-if="column.dataIndex === 'address'">
          <a-input v-if="editingKey === record.key" v-model:value="editingRow.address" />
          <template v-else>{{ record.address }}</template>
        </template>

        <template v-else-if="column.dataIndex === 'operation'">
          <div class="editable-row-operations">
            <template v-if="editingKey === record.key">
              <a-space>
                <a @click="saveRow(record.key)">保存</a>
                <a @click="cancelEdit">取消</a>
              </a-space>
            </template>
            <template v-else>
              <a-space>
                <a @click="editRow(record)">编辑</a>
                <a @click="deleteRow(record.key)">删除</a>
              </a-space>
            </template>
          </div>
        </template>
      </template>
    </a-table>

    <a-button type="dashed" style="width: 100%; margin-top: 16px" @click="addRow">
      添加行
    </a-button>
  </a-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';

defineOptions({
  name: 'TableForm',
});

interface IDataSource {
  key: string;
  name: string;
  age: number;
  address: string;
}
const columns = [
  { title: '姓名', dataIndex: 'name', width: '25%' },
  { title: '年龄', dataIndex: 'age', width: '15%' },
  { title: '地址', dataIndex: 'address', width: '40%' },
  { title: '操作', dataIndex: 'operation', width: '20%' },
];

const dataSource = ref<IDataSource[]>([
  { key: '1', name: '张三', age: 32, address: '北京市朝阳区' },
  { key: '2', name: '李四', age: 28, address: '上海市浦东新区' },
]);

const editingKey = ref('');
const editingRow = reactive({
  name: '',
  age: 0,
  address: '',
});

const editRow = (record: IDataSource) => {
  editingKey.value = record.key;
  Object.assign(editingRow, record);
};

const cancelEdit = () => {
  editingKey.value = '';
};

const saveRow = (key: string) => {
  const index = dataSource.value.findIndex((item) => item.key === key);
  Object.assign(dataSource.value[index], editingRow);
  editingKey.value = '';
  message.success('保存成功！');
};

const deleteRow = (key: string) => {
  dataSource.value = dataSource.value.filter((item) => item.key !== key);
  message.success('删除成功！');
};

const addRow = () => {
  const newKey = `${dataSource.value.length + 1}`;
  dataSource.value.push({
    key: newKey,
    name: `新员工 ${newKey}`,
    age: 25,
    address: '',
  });
};
</script>
