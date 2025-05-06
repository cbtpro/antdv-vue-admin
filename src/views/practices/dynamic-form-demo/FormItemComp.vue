<script lang="ts" setup>
import { computed } from 'vue';
import type { FormItem } from './FormItem';

interface IProps {
  value: FormItem | null;
}
const props = withDefaults(defineProps<IProps>(), {
  value: null,
});

const emit = defineEmits<{
  (e: 'update:value', key: string, value: any): void;
}>();
const localModel = computed({
  get: () => {
    return props.value;
  },
  set: (value) => {
    updateValue(value);
  }
});

function getNext(): FormItem | null {
  let current: FormItem | null = localModel.value;
  if (!current) return null;

  const acients = [];
  acients.unshift(current);
  while (current === current.parent) {
    acients.unshift(current);
  }
  return props.value!.next(props.value!, acients);
}

function updateValue(val: any) {
  emit('update:value', props.value!.payload.field, val);
}
</script>

<template>
  <template v-if="value">
    <a-form-item :label="value.payload.label" :name="value.payload.field">
      <template v-if="value.type === 'input'">
        {{ localModel }}
        <a-input :value="localModel?.payload.value" @update:value="updateValue" />
      </template>
      <template v-else-if="value.type === 'select'">
        <a-select v-model:value="value.payload.value" @change="updateValue">
          <a-select-option v-for="opt in value.payload.options" :value="opt.value" :key="opt.value">
            {{ opt.label }}
          </a-select-option>
        </a-select>
      </template>
      <template v-else-if="value.type === 'checkbox'">
        <a-checkbox-group v-model:value="value.payload.value" @change="updateValue">
          <a-checkbox v-for="opt in value.payload.options" :value="opt.value" :key="opt.value">
            {{ opt.label }}
          </a-checkbox>
        </a-checkbox-group>
      </template>
      <template v-else-if="value.type === 'radio'">
        <a-radio-group v-model:value="value.payload.value" @change="updateValue">
          <a-radio v-for="opt in value.payload.options" :value="opt.value" :key="opt.value">
            {{ opt.label }}
          </a-radio>
        </a-radio-group>
      </template>
    </a-form-item>

    <FormItemComp :value="getNext()" @update:value="emit('update:value', $event[0], $event[1])" />
  </template>
</template>
