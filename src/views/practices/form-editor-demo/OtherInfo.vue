<template>
  <div class="box">
    <a-form-item name="note" label="备注">
      <a-textarea v-model:value="localModel.note"></a-textarea>
    </a-form-item>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  name: 'OtherInfo'
});

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
