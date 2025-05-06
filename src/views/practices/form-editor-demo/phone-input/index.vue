<template>
  <div class="phone-input">
    <a-row :gutter="[6, { xs: 8, sm: 16, md: 24, lg: 32 }]">
      <!-- <a-col :xs="{ span: 24 }" :md="{ span: 5 }">
        <a-form-item noStyle>
          <a-select v-model:value="region" placeholder="请选择" :options="regionList" />
        </a-form-item>
      </a-col> -->
      <a-col :xs="{ span: 24 }" :md="{ span: 17 }">
        <a-form-item noStyle>
          <a-input v-model:value="localValue" />
        </a-form-item>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
// import { getCountries } from '@/utils/country';

defineOptions({
  name: 'PhoneInput'
});

const props = defineProps(['value']);
const emit = defineEmits(['update:value']);

const region = ref('+86');

// const countries = getCountries();
// const regionList = countries.map(item => ({
//   label: item.flag + ' ' + item.name + ' ' + item.country_code,
//   value: item.country_code
// }));
const localValue = computed({
  get: () => props.value,
  set: value => emit('update:value', value)
});
</script>

<style lang="less" scoped>
.phone-input {
  /** 组件样式 **/
}
</style>
