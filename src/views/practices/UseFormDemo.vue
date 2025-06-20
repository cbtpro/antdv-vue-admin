<template>
  <div class="use-form-container">
    <a-card title="Form.useForm 示例">
      <a-form :model="model" layout="vertical" autocomplete="off">
        <a-form-item label="姓名" v-bind="validateInfos.name">
          <a-input v-model:value="model.name" />
        </a-form-item>

        <a-form-item label="年龄" v-bind="validateInfos.age">
          <a-input-number v-model:value="model.age" style="width: 100%" :min="0" :max="150" />
        </a-form-item>

        <a-form-item label="邮箱" v-bind="validateInfos.email">
          <a-input v-model:value="model.email" />
        </a-form-item>

        <a-form-item label="个人网站" v-bind="validateInfos.website">
          <a-input v-model:value="model.website" placeholder="https://example.com" />
        </a-form-item>

        <a-form-item label="个人介绍" v-bind="validateInfos.introduction">
          <a-textarea
            v-model:value="model.introduction"
            :rows="4"
            placeholder="请简单介绍一下自己"
          />
        </a-form-item>

        <a-form-item v-bind="validateInfos.agreement">
          <a-checkbox v-model:checked="model.agreement">
            我已阅读并同意
            <a href="#" @click.prevent>用户协议</a>
          </a-checkbox>
        </a-form-item>

        <a-form-item>
          <a-space>
            <a-button type="primary" @click="onSubmit">提交</a-button>
            <a-button @click="onReset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Form, message } from 'ant-design-vue';
import type { Rule, RuleObject } from 'ant-design-vue/es/form';
import { deepClone } from '@/utils';

interface FormState {
  name: string;
  age: number | null;
  email: string;
  website: string;
  introduction: string;
  agreement: boolean;
}

const initialValues: FormState = {
  name: 'demo',
  age: null,
  email: '',
  website: '',
  introduction: '',
  agreement: false,
};

const rules = ref<Record<keyof FormState, Rule[]>>({
  name: [
    { required: true, message: '请输入姓名' },
    { min: 2, message: '姓名至少2个字符' },
  ],
  age: [
    { required: true, message: '请输入年龄' },
    { type: 'number', min: 0, max: 150, message: '年龄必须在0-150之间' },
  ],
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '请输入有效的邮箱地址' },
  ],
  website: [
    { required: true, message: '请输入网站' },
    { type: 'url', message: '请输入有效的网址' },
  ],
  introduction: [
    { required: true, message: '请输入介绍' },
    { min: 10, message: '介绍至少10个字符' },
  ],
  agreement: [
    {
      validator: async (_rule: RuleObject, value: boolean) => {
        console.log('_rule', _rule.type);
        if (!value) {
          return Promise.reject('请同意用户协议！');
        }
        return Promise.resolve();
      },
    },
  ],
});
const model = ref<FormState>(deepClone(initialValues));
const formInstance = Form.useForm(model, rules);

const { validateInfos } = formInstance;

const onSubmit = async () => {
  try {
    console.log('initialValues: ', initialValues);
    await formInstance.validate();
    message.success('提交成功！');
    console.log('表单数据：', model.value);
  } catch (errors) {
    console.log('验证失败：', errors);
  }
};

const onReset = () => {
  formInstance.resetFields(['name', 'age', 'email', 'website', 'introduction', 'agreement']);
};
</script>

<style scoped>
.use-form-container {
  padding: 24px;
  background: #f0f2f5;
  min-height: 100%;
}
</style>
