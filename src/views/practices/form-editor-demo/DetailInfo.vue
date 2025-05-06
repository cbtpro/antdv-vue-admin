<template>
  <div class="box">
    <a-form-item name="address" label="地址">
      <a-input v-model:value="localModel.address" />
    </a-form-item>
    <a-form-item label="电话" :name="['detail', 'phone']"
      :rules="[{ required: true, validator: customValidatePhoneHandle }]">
      <PhoneInput v-model:value="localModel.phone" />
    </a-form-item>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Rule } from 'ant-design-vue/es/form/interface';
import PhoneInput from './phone-input/index.vue';
// import { isValidPhoneNumber } from '@/utils/validate.phone';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const localModel = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
});
const customValidatePhoneHandle = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject('请输入手机号!');
  } else {
    // if (!isValidPhoneNumber(value)) {
    //   return Promise.reject('请输入正确的手机号!');
    // }
    return Promise.resolve();
  }
};
</script>

<style scoped>
.box {
  padding: 32px 16px;
}
</style>
