<template>
  <a-card title="动态表单">
    <a-form :model="formState" @finish="onFinish" layout="vertical">
      <a-form-item
        v-for="(tag, index) in formState.tags"
        :key="index"
        :label="`标签 ${index + 1}`"
        :name="['tags', index, 'value']"
        :rules="getTagsRules(index)"
      >
        <a-input v-model:value="tag.value">
          <template #suffix>
            <minus-circle-outlined
              v-if="formState.tags.length > 1"
              @click="removeTagsHandle(index)"
              style="color: #ff4d4f"
            />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-button type="dashed" block @click="addTagsHandle"> <plus-outlined /> 添加标签 </a-button>
      </a-form-item>

      <a-form-item name="fields">
        <template #label>
          <a-space>
            自定义属性
            <plus-circle-outlined
              v-if="customFieldsRef?.isEmpty"
              @click="customFieldsRef?.addFieldsHandle(0)"
              class="add-icon"
            />
          </a-space>
        </template>
        <a-form-item-rest>
          <CustomFields ref="customFieldsRef" v-model:value="formState.fields" />
        </a-form-item-rest>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
    <!-- <JSONViewHelper label="表单数据" :data="formState" :defualtValue="[]" /> -->
  </a-card>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { PlusOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { RuleObject } from 'ant-design-vue/es/form';
import CustomFields from './custom-fields.vue';
// import JSONViewHelper from '@/utils/helper/JSONViewHelper';

defineOptions({ name: 'DynamicForm' });

const formState = reactive<FormState>({
  tags: [{ value: '' }],
  fields: [],
});

const getTagsRules = (index: number) => {
  return [
    {
      required: true,
      validator: (_rule: RuleObject, value: number | string) => {
        if (!value) {
          return Promise.reject('请输入标签值');
        }
        const duplicate = formState.tags.some((item, idx) => {
          return idx !== index && item.value === value;
        });
        return duplicate ? Promise.reject('标签值不能重复') : Promise.resolve();
      },
      trigger: 'blur',
    },
  ];
};

const addTagsHandle = () => {
  formState.tags.push({ value: '' });
};

const removeTagsHandle = (index: number) => {
  formState.tags.splice(index, 1);
};

const customFieldsRef = ref<ComponentExposed<typeof CustomFields>>();

const onFinish = (values: number) => {
  console.log('表单数据:', values);
  message.success('提交成功！');
};
</script>

<style scoped>
.field-list {
  display: flex;
  column-gap: 4px;
  row-gap: 6px;
}
.add-icon {
  color: green;
}
.delete-icon {
  color: red;
}
</style>
