<script setup lang="ts">
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';

const current = ref(0);

const formState = reactive({
  // Step 1: Account
  username: '',
  password: '',
  confirmPassword: '',

  // Step 2: Details
  name: '',
  email: '',
  phone: '',
  address: '',

  // Step 3: Confirmation
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
  name: [{ required: true, message: '请输入姓名' }],
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '请输入有效的邮箱地址' }
  ],
  phone: [
    { required: true, message: '请输入手机号' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
  ],
  address: [{ required: true, message: '请输入地址' }],
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

const formRef1 = ref();
const formRef2 = ref();
const formRef3 = ref();

const next = async () => {
  try {
    if (current.value === 0) {
      await formRef1.value?.validate();
    } else if (current.value === 1) {
      await formRef2.value?.validate();
    }
    current.value++;
  } catch (error) {
    console.log('验证失败：', error);
  }
};

const prev = () => {
  current.value--;
};

const handleSubmit = async () => {
  try {
    await formRef3.value?.validate();
    message.success('提交成功！');
    console.log('表单数据：', formState);
  } catch (error) {
    console.log('验证失败：', error);
  }
};

const steps = [
  {
    title: '账户信息',
    content: 'account-form'
  },
  {
    title: '个人信息',
    content: 'details-form'
  },
  {
    title: '确认信息',
    content: 'confirm-form'
  }
];
</script>

<template>
  <div class="step-form-container">
    <a-card title="分步表单示例">
      <a-steps v-model:current="current">
        <a-step v-for="item in steps" :key="item.title" :title="item.title" />
      </a-steps>

      <div class="steps-content">
        <!-- Step 1: Account Form -->
        <div v-show="current === 0">
          <a-form ref="formRef1" :model="formState" :rules="rules" layout="vertical">
            <a-form-item label="用户名" name="username">
              <a-input v-model:value="formState.username" />
            </a-form-item>

            <a-form-item label="密码" name="password">
              <a-input-password v-model:value="formState.password" />
            </a-form-item>

            <a-form-item label="确认密码" name="confirmPassword">
              <a-input-password v-model:value="formState.confirmPassword" />
            </a-form-item>
          </a-form>
        </div>

        <!-- Step 2: Details Form -->
        <div v-show="current === 1">
          <a-form ref="formRef2" :model="formState" :rules="rules" layout="vertical">
            <a-form-item label="姓名" name="name">
              <a-input v-model:value="formState.name" />
            </a-form-item>

            <a-form-item label="邮箱" name="email">
              <a-input v-model:value="formState.email" />
            </a-form-item>

            <a-form-item label="手机号" name="phone">
              <a-input v-model:value="formState.phone" />
            </a-form-item>

            <a-form-item label="地址" name="address">
              <a-textarea v-model:value="formState.address" :rows="4" placeholder="请输入详细地址" />
            </a-form-item>
          </a-form>
        </div>

        <!-- Step 3: Confirmation -->
        <div v-show="current === 2">
          <a-form ref="formRef3" :model="formState" :rules="rules" layout="vertical">
            <a-descriptions title="账户信息" bordered>
              <a-descriptions-item label="用户名">
                {{ formState.username }}
              </a-descriptions-item>
            </a-descriptions>

            <a-descriptions title="个人信息" bordered style="margin-top: 24px">
              <a-descriptions-item label="姓名">
                {{ formState.name }}
              </a-descriptions-item>
              <a-descriptions-item label="邮箱">
                {{ formState.email }}
              </a-descriptions-item>
              <a-descriptions-item label="手机号">
                {{ formState.phone }}
              </a-descriptions-item>
              <a-descriptions-item label="地址">
                {{ formState.address }}
              </a-descriptions-item>
            </a-descriptions>

            <a-form-item name="agreement" style="margin-top: 24px">
              <a-checkbox v-model:checked="formState.agreement">
                我已阅读并同意
                <a href="#" @click.prevent>用户协议</a>
              </a-checkbox>
            </a-form-item>
          </a-form>
        </div>
      </div>

      <div class="steps-action">
        <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">
          上一步
        </a-button>
        <a-button v-if="current < steps.length - 1" type="primary" @click="next">
          下一步
        </a-button>
        <a-button v-if="current === steps.length - 1" type="primary" @click="handleSubmit">
          提交
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<style scoped>
.step-form-container {
  padding: 24px;
  background: #f0f2f5;
  min-height: 100%;
}

.steps-content {
  margin-top: 24px;
  padding: 24px;
  background: #fff;
  min-height: 200px;
}

.steps-action {
  margin-top: 24px;
}

:deep(.ant-steps) {
  max-width: 750px;
  margin: 0 auto;
}
</style>
