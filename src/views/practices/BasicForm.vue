<template>
  <a-card title="基础表单">
    <a-form :model="formState" :rules="rules" @finish="onFinish" layout="vertical">
      <a-form-item label="用户名" name="username">
        <a-input v-model:value="formState.username" />
      </a-form-item>

      <a-form-item label="邮箱" name="email">
        <a-input v-model:value="formState.email" />
      </a-form-item>

      <a-form-item label="性别" name="gender">
        <a-radio-group v-model:value="formState.gender">
          <a-radio value="male">男</a-radio>
          <a-radio value="female">女</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="兴趣爱好" name="hobbies">
        <a-checkbox-group v-model:value="formState.hobbies">
          <a-checkbox value="reading">阅读</a-checkbox>
          <a-checkbox value="sports">运动</a-checkbox>
          <a-checkbox value="music">音乐</a-checkbox>
        </a-checkbox-group>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { message } from 'ant-design-vue';

interface IFormState {
  username: string;
  email: string;
}
const formState = reactive({
  username: '',
  email: '',
  gender: 'male',
  hobbies: [],
});

const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '请输入有效的邮箱地址' },
  ],
  gender: [{ required: true, message: '请选择性别' }],
  hobbies: [{ required: true, message: '请选择至少一个兴趣爱好' }],
};

const onFinish = (values: IFormState) => {
  console.log('表单数据:', values);
  message.success('提交成功！');
};
</script>
