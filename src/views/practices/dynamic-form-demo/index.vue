<script setup lang="ts">
import { reactive, ref } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
import StickyFooterLayout from '@/components/StickyFooterLayout.vue';
import FormItemComp from './FormItemComp.vue';
import root from './FormPageDatas';
import type { FormItem } from './FormItem';
import { collectFormModelAndRules } from './collectFormModel';

const boundingInfoOptions = { prefix: '--dynamic-form-demo-bounding-info-' };


const formRef = ref<FormInstance>();
const { model, rules } = collectFormModelAndRules(root);
const formModel = ref(model.value ?? {});

function updateField(key: string, val: any) {
  formModel.value[key] = val;
}
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    console.log('表单数据：', formModel.value);
    message.success('提交成功！');
  } catch (error) {
    console.error('验证失败：', error);
  }
};

const handleReset = () => {
  formRef.value?.resetFields();
};

</script>
<template>
  <div v-bounding-info-to-css-var:[boundingInfoOptions] class="container">
    <StickyFooterLayout>
      {{ formModel }}
      <a-form ref="formRef" :model="formModel" :rules="rules" layout="vertical">
        <FormItemComp :value="root" @update:value="updateField" />
      </a-form>
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

<style lang="less" scoped>
.container {
  padding: 24px 24px 0;
  height: calc(100vh - var(--dynamic-form-demo-bounding-info-top) - var(--footer-height));
}
</style>
