<template>
  <div class="box">
    <a-form-item :name="['basic', 'name']" label="姓名" :rules="[{ required: true, message: '请输入姓名!' }]">
      <a-input v-model:value="localModel.name" name="name" type="text" class="form-item-input" />
    </a-form-item>
    <a-form-item :name="['basic', 'age']" label="年龄" :rules="[{ required: true, message: '请输入年龄!' }]">
      <a-input-number v-model:value.number="localModel.age" name="age" class="form-item-input" />
    </a-form-item>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  name: 'BasicInfo'
});

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const localModel = computed({
  get: () => {
    return props.modelValue;
  },
  set: value => {
    emit('update:modelValue', value);
  }
});
</script>

<style lang="less" scoped>
.box {
  padding: 32px 16px;

  .form-item-input {
    display: flex;
  }
}
</style>
