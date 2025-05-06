<template>
  <div>
    <h2>表单编辑</h2>
    <a-form ref="formRef" :model="form" :label-col="{
      xs: { span: 24 },
      sm: { span: 4 }
    }" :wrapper-col="{
      xs: { span: 24 },
      sm: { span: 20 }
    }">
      <a-steps :current="current">
        <a-step v-for="item in steps" :key="item.title" :title="item.title" />
      </a-steps>
      <BasicInfo v-if="current == 0" v-model="form.basic" />
      <DetailInfo v-if="current == 1" v-model="form.detail" />
      <ExtendInfo v-if="current == 2" v-model="form.extend" />
      <OtherInfo v-if="current == 3" v-model="form.other" />
      <div class="steps-action">
        <a-space>
          <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">
            上一步
          </a-button>
          <a-button v-if="current < steps.length - 1" type="primary" @click="next">
            下一步
          </a-button>
          <a-button v-if="current == steps.length - 1" type="primary" htmlType="submit" @click="submitFormHandle">
            提交
          </a-button>
        </a-space>
      </div>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import BasicInfo from './BaseInfo.vue';
import DetailInfo from './DetailInfo.vue';
import ExtendInfo from './ExtendInfo.vue';
import OtherInfo from './OtherInfo.vue';

/**
 * 表单编辑器
 */
interface IFormData {
  basic: {
    name?: string;
    age?: number;
  };
  detail: {
    address?: string;
    phone?: string;
  };
  extend: {
    company?: string;
    position?: string;
  };
  other: {
    note?: string;
  };
}

defineOptions({
  name: 'FormEditor'
});

const formRef = ref<FormInstance>();
const form = ref<IFormData>({
  basic: { name: undefined, age: undefined },
  detail: { address: undefined, phone: undefined },
  extend: { company: undefined, position: undefined },
  other: { note: undefined }
});

onMounted(() => {
  window.setTimeout(() => {
    form.value = {
      basic: { name: '大反派', age: 99 },
      detail: { address: '地球', phone: '+8618911111111' },
      extend: { company: '偷着乐有限责任公司', position: '杂鱼' },
      other: { note: '备注' }
    };
  }, 800);
});

const steps = [
  {
    title: '基础信息'
  },
  {
    title: '详细信息'
  },
  {
    title: '扩展信息'
  },
  {
    title: '其他信息'
  }
];
const current = ref<number>(0);
const next = async () => {
  try {
    await formRef.value?.validate();
    current.value++;
    if (current.value === steps.length - 1) {
      console.log(form.value);
    }
  } catch (error) {
    console.log(error);
  }
};
const prev = () => {
  current.value--;
};

const submitFormHandle = async () => {
  try {
    await formRef.value?.validate();
    console.log(form.value);
  } catch (error) {
    console.log(error);
  }
};
</script>
