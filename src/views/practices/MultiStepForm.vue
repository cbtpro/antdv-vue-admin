<template>
  <a-card title="多步骤表单">
    <a-steps :current="currentStep" style="margin-bottom: 24px">
      <a-step title="基本信息" />
      <a-step title="联系方式" />
      <a-step title="完成" />
    </a-steps>

    <div v-if="currentStep === 0">
      <a-form :model="formState.step1" @finish="nextStep" layout="vertical">
        <a-form-item label="姓名" name="name" :rules="[{ required: true }]">
          <a-input v-model:value="formState.step1.name" />
        </a-form-item>

        <a-form-item label="年龄" name="age" :rules="[{ required: true }]">
          <a-input-number v-model:value="formState.step1.age" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit">下一步</a-button>
        </a-form-item>
      </a-form>
    </div>

    <div v-if="currentStep === 1">
      <a-form :model="formState.step2" @finish="nextStep" layout="vertical">
        <a-form-item label="电话" name="phone" :rules="[{ required: true }]">
          <a-input v-model:value="formState.step2.phone" />
        </a-form-item>

        <a-form-item label="地址" name="address" :rules="[{ required: true }]">
          <a-textarea v-model:value="formState.step2.address" />
        </a-form-item>

        <a-form-item>
          <a-space>
            <a-button @click="prevStep">上一步</a-button>
            <a-button type="primary" html-type="submit">下一步</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>

    <div v-if="currentStep === 2">
      <result title="提交成功！" status="success">
        <template #extra>
          <a-button type="primary" @click="reset">完成</a-button>
        </template>
      </result>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Result } from 'ant-design-vue';

const currentStep = ref(0);

const formState = reactive({
  step1: {
    name: '',
    age: null
  },
  step2: {
    phone: '',
    address: ''
  }
});

const nextStep = () => {
  currentStep.value++;
};

const prevStep = () => {
  currentStep.value--;
};

const reset = () => {
  currentStep.value = 0;
  formState.step1.name = '';
  formState.step1.age = null;
  formState.step2.phone = '';
  formState.step2.address = '';
};
</script>
