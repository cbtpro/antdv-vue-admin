<template>
  <a-card title="动态表单">
    <a-form :model="formState" @finish="onFinish" layout="vertical">
      <a-form-item
        v-for="(field, index) in formState.fields"
        :key="index"
        :label="`字段 ${index + 1}`"
        :name="['fields', index, 'value']"
        :rules="{ required: true, message: '请输入字段值' }"
      >
        <a-input v-model:value="field.value">
          <template #suffix>
            <minus-circle-outlined
              v-if="formState.fields.length > 1"
              @click="removeField(index)"
              style="color: #ff4d4f"
            />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-button type="dashed" block @click="addField"> <plus-outlined /> 添加字段 </a-button>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

defineOptions({ name: 'DynamicForm' });

const formState = reactive({
  fields: [{ value: '' }],
});

const addField = () => {
  formState.fields.push({ value: '' });
};

const removeField = (index: number) => {
  formState.fields.splice(index, 1);
};

const onFinish = (values: number) => {
  console.log('表单数据:', values);
  message.success('提交成功！');
};
</script>
