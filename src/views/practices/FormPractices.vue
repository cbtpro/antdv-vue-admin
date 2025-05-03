<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import StickyFooterLayout from '@/components/StickyFooterLayout.vue';
import RichEditor from '@/components/RichEditor.vue';
import RichEditorInline from '@/components/RichEditorInline.vue';

const formRef = ref<FormInstance>();
const formLayout = ref<'horizontal' | 'vertical' | 'inline'>('horizontal');

const formState = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  email: '',
  phone: '',
  gender: undefined,
  interests: [],
  introduction: '',
  agreement: false
});

const rules = {
  username: [
    { required: true, message: '请输入用户名' },
    { min: 4, message: '用户名至少4个字符' }
  ],
  password: [
    { required: true, message: '请输入密码' },
    { min: 6, message: '密码至少6个字符' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码' },
    {
      validator: async (_rule: any, value: string) => {
        if (value !== formState.password) {
          throw new Error('两次输入的密码不一致');
        }
      }
    }
  ],
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '请输入有效的邮箱地址' }
  ],
  phone: [
    { required: true, message: '请输入手机号' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', }
  ],
  gender: [{ required: true, message: '请选择性别' }],
  introduction: [{ required: true, message: '请输入个人简介', }],
  agreement: [
    {
      validator: async (_rule: any, value: boolean) => {
        if (!value) {
          throw new Error('请同意用户协议');
        }
      }
    }
  ]
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    message.success('提交成功！');
    console.log('表单数据：', formState);
  } catch (error) {
    console.log('验证失败：', error);
  }
};

const handleReset = () => {
  formRef.value?.resetFields();
};

const boundingInfoOptions = { prefix: '--bounding-info-' };

const toggleIntroductionVisible = () => {

};
</script>

<template>
  <div v-bounding-info-to-css-var:[boundingInfoOptions] class="form-container">
    <StickyFooterLayout>
      <a-card title="表单最佳实践示例">
        <template #extra>
          <a-space>
            <a-radio-group v-model:value="formLayout">
              <a-radio-button value="horizontal">水平</a-radio-button>
              <a-radio-button value="vertical">垂直</a-radio-button>
              <a-radio-button value="inline">行内</a-radio-button>
            </a-radio-group>
          </a-space>
        </template>

        <a-form ref="formRef" :model="formState" :rules="rules" :layout="formLayout"
          :label-col="formLayout === 'horizontal' ? { span: 4 } : null"
          :wrapper-col="formLayout === 'horizontal' ? { span: 14 } : null">
          <a-form-item label="用户名" name="username">
            <a-input v-model:value="formState.username" />
          </a-form-item>

          <a-form-item label="密码" name="password">
            <a-input-password v-model:value="formState.password" />
          </a-form-item>

          <a-form-item label="确认密码" name="confirmPassword">
            <a-input-password v-model:value="formState.confirmPassword" />
          </a-form-item>

          <a-form-item label="昵称" name="nickname">
            <a-input v-model:value="formState.nickname" />
          </a-form-item>

          <a-form-item label="邮箱" name="email">
            <a-input v-model:value="formState.email" />
          </a-form-item>

          <a-form-item label="手机号" name="phone">
            <a-input v-model:value="formState.phone" />
          </a-form-item>

          <a-form-item label="性别" name="gender">
            <a-radio-group v-model:value="formState.gender">
              <a-radio value="male">男</a-radio>
              <a-radio value="female">女</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item label="兴趣爱好" name="interests">
            <a-checkbox-group v-model:value="formState.interests">
              <a-checkbox value="reading">阅读</a-checkbox>
              <a-checkbox value="music">音乐</a-checkbox>
              <a-checkbox value="sports">运动</a-checkbox>
              <a-checkbox value="travel">旅行</a-checkbox>
            </a-checkbox-group>
          </a-form-item>

          <a-form-item label="个人简介" name="introduction" @click="toggleIntroductionVisible">
            <!-- <a-textarea v-model:value="formState.introduction" :rows="4" placeholder="请输入个人简介" /> -->
            <RichEditorInline v-if="formLayout === 'inline'" v-model:value="formState.introduction"
              placeholder="请输入个人简介" />
            <RichEditor v-else v-model:value="formState.introduction" placeholder="请输入个人简介" />
          </a-form-item>

          <a-form-item name="agreement" :wrapper-col="{ offset: formLayout === 'horizontal' ? 4 : 0 }">
            <a-checkbox v-model:checked="formState.agreement">
              我已阅读并同意
              <a href="#" @click.prevent>用户协议</a>
            </a-checkbox>
          </a-form-item>
        </a-form>
      </a-card>
      <template #footer>
        <div class="footer-buttons">
          <a-space>
            <a-button type="primary" @click="handleSubmit">提交</a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-space>
        </div>

      </template>
    </StickyFooterLayout>
  </div>
</template>

<style scoped>
.form-container {
  /* padding: 12px; */
  min-height: 100%;
  height: calc(100vh - var(--bounding-info-top) - var(--footer-height));
}
</style>
