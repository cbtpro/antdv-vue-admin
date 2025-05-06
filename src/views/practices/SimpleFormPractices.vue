<template>
  <div class="related-form-practices">
    <a-form :model="form" ref="formRef">
      <a-form-item label="被除数" name="a" :rules="[{ required: true, message: '请输入被除数' }]">
        <a-input v-model:value.number="form.a" />
      </a-form-item>

      <a-form-item label="除数" name="b" :rules="divisorRules">
        <a-input v-model:value.number="form.b" />
      </a-form-item>

      <a-form-item label="商" name="c">
        <a-input v-model:value="form.c" disabled />
      </a-form-item>

      <a-button type="primary" @click="submitForm">提交</a-button>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { message } from "ant-design-vue";
import type { FormInstance, Rule } from "ant-design-vue/es/form";

interface IFormState {
  a: number | null;
  b: number | null;
  c: number | null;
}
const formRef = ref<FormInstance | null>(null);
const form = ref<IFormState>({
  a: null,
  b: null,
  c: null,
});

const divisorRules = [
  { required: true, message: "请输入除数" },
  {
    validator: (rule: Rule, value: number) => {
      if (value === 0) {
        return Promise.reject('除数不能为0');
      }
      return Promise.resolve();
    },
  },
];
// 监听 a 和 b 变化，动态计算 c 的值
watch([() => form.value.a, () => form.value.b], ([newA, newB]) => {
  if (newB === null || newB === 0) {
    return;
  }
  form.value.c = (newA ?? 0) / newB; // 计算 C 的值
  formRef.value?.validateFields(["c"]); // 触发 C 的校验
});

// 提交表单
const submitForm = () => {
  if (!formRef.value) {
    return;
  }
  formRef.value
    .validate()
    .then(() => {
      message.success("提交成功！");
    })
    .catch(() => {
      message.error("请检查表单");
    });
};
</script>

<style lang="less" scoped>
.related-form-practices {
  padding: 24px 24px;
}
</style>
