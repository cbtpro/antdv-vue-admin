<template>
  <div class="flex gap-2 items-start">
    <select v-model="selectedCountry" @change="onCountryChange" class="border p-1 rounded">
      <option v-for="country in countryOptions" :key="country.code" :value="country.code">
        {{ country.name }} ({{ country.dialCode }})
      </option>
    </select>

    <input
      type="tel"
      v-model="phone"
      @blur="validatePhone"
      class="border p-1 rounded w-full"
      placeholder="请输入手机号"
    />
  </div>

  <p v-if="error" class="text-red-500 mt-1">{{ error }}</p>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { isValidPhoneNumber, parsePhoneNumberFromString, getCountries, getCountryCallingCode } from 'libphonenumber-js'

// 国家列表（可按需裁剪）
const countryOptions = [
  { code: 'CN', name: '中国', dialCode: '+86' },
  { code: 'US', name: '美国', dialCode: '+1' },
  { code: 'GB', name: '英国', dialCode: '+44' },
  { code: 'IN', name: '印度', dialCode: '+91' },
  // ...更多国家
]

const selectedCountry = ref('CN')
const phone = ref('')
const error = ref('')

const validatePhone = () => {
  const dialCode = countryOptions.find(c => c.code === selectedCountry.value)?.dialCode || ''
  const fullNumber = `${dialCode}${phone.value}`

  const parsed = parsePhoneNumberFromString(fullNumber)
  if (!parsed || !parsed.isValid()) {
    error.value = '手机号格式不正确'
  } else {
    error.value = ''
    // 你可以在这里 emit 或调用回调函数，将合法格式的号码传出去
    console.log('合法号码：', parsed.number) // E.164 格式，如 +8613800000000
  }
}

const onCountryChange = () => {
  error.value = ''
}
</script>

<style scoped>
select {
  min-width: 140px;
}
</style>
