<template>
  <div class="box">
    <a-form-item name="company" label="公司">
      <a-input v-model:value="localModel.company" type="text" />
    </a-form-item>
    <a-form-item name="position" label="职位">
      <a-input v-model:value="localModel.position" type="text" />
    </a-form-item>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const localModel = computed({
  get: () => props.modelValue,
  set: value => {
    emit('update:modelValue', value);
  }
});
</script>

<style scoped>
.box {
  padding: 32px 16px;
}
</style>
