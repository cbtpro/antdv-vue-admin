<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  parsePhoneNumberWithError,
  AsYouType,
  getExampleNumber,
  type CountryCode,
} from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';

const props = defineProps<{
  value?: string;
  countryCode?: string;
}>();

const emit = defineEmits<{
  (e: 'update:value', value: string): void;
  (e: 'update:countryCode', code: string): void;
  (e: 'validate', valid: boolean): void;
}>();

const phoneNumber = ref(props.value || '');
const selectedCountry = ref(props.countryCode || 'CN');
const isValid = ref(false);
const formatter = ref(new AsYouType());

// 获取所有支持的国家列表
const countries = [
  { code: 'CN', name: '中国 (+86)', example: getExampleNumber('CN', examples)?.formatNational() },
  { code: 'HK', name: '香港 (+852)', example: getExampleNumber('HK', examples)?.formatNational() },
  { code: 'TW', name: '台湾 (+886)', example: getExampleNumber('TW', examples)?.formatNational() },
  { code: 'US', name: '美国 (+1)', example: getExampleNumber('US', examples)?.formatNational() },
  { code: 'GB', name: '英国 (+44)', example: getExampleNumber('GB', examples)?.formatNational() },
  { code: 'JP', name: '日本 (+81)', example: getExampleNumber('JP', examples)?.formatNational() },
  { code: 'KR', name: '韩国 (+82)', example: getExampleNumber('KR', examples)?.formatNational() },
];

// 验证手机号
const validatePhoneNumber = (number: string, country: string) => {
  try {
    const phoneNumber = parsePhoneNumberWithError(number, country as CountryCode);
    isValid.value = phoneNumber.isValid();
    emit('validate', isValid.value);
  } catch (error) {
    console.error(error);
    isValid.value = false;
    emit('validate', false);
  }
};

// 处理输入变化
const handleInput = (e: Event) => {
  const input = (e.target as HTMLInputElement).value;
  formatter.value = new AsYouType(selectedCountry.value as CountryCode);
  const formatted = formatter.value.input(input);
  phoneNumber.value = formatted;
  emit('update:value', formatted);
  validatePhoneNumber(formatted, selectedCountry.value);
};

// 处理国家选择
const handleCountryChange = (value: string) => {
  selectedCountry.value = value;
  emit('update:countryCode', value);
  if (phoneNumber.value) {
    validatePhoneNumber(phoneNumber.value, value);
  }
};

// 监听属性变化
watch(
  () => props.value,
  (newValue) => {
    if (newValue !== phoneNumber.value) {
      phoneNumber.value = newValue || '';
    }
  },
);

watch(
  () => props.countryCode,
  (newValue) => {
    if (newValue !== selectedCountry.value) {
      selectedCountry.value = newValue || 'CN';
    }
  },
);
</script>

<template>
  <div class="phone-number-input">
    <a-space>
      <a-select v-model:value="selectedCountry" style="width: 180px" @change="handleCountryChange">
        <a-select-option v-for="country in countries" :key="country.code" :value="country.code">
          {{ country.name }}
        </a-select-option>
      </a-select>

      <a-input
        v-model:value="phoneNumber"
        @input="handleInput"
        :status="phoneNumber && !isValid ? 'error' : ''"
        :placeholder="countries.find((c) => c.code === selectedCountry)?.example || '请输入手机号'"
      >
        <template #suffix>
          <check-circle-outlined v-if="isValid" style="color: #52c41a" />
          <close-circle-outlined v-else-if="phoneNumber && !isValid" style="color: #ff4d4f" />
        </template>
      </a-input>
    </a-space>

    <div v-if="phoneNumber && !isValid" class="error-message">请输入有效的手机号码</div>
  </div>
</template>

<style scoped>
.phone-number-input {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
}

.error-message {
  color: #ff4d4f;
  font-size: 12px;
}
</style>
