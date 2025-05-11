<template>
  <a-card title="自定义表单控件">
    <a-form :model="formState" @finish="onFinish" layout="vertical">
      <a-form-item label="评分" name="rating">
        <div class="custom-rating">
          <a-rate v-model:value="formState.rating" />
          <span class="rating-text">{{ ratingTexts[formState.rating - 1] || '请评分' }}</span>
        </div>
      </a-form-item>

      <a-form-item label="价格范围" name="priceRange">
        <div class="price-range">
          <a-slider v-model:value="formState.priceRange" range :min="0" :max="1000" :step="10" />
          <div class="price-inputs">
            <a-input-number v-model:value="formState.priceRange[0]" :min="0" :max="formState.priceRange[1]" />
            <span class="separator">-</span>
            <a-input-number v-model:value="formState.priceRange[1]" :min="formState.priceRange[0]" :max="1000" />
          </div>
        </div>
      </a-form-item>

      <a-form-item label="标签选择" name="tags">
        <div class="tag-selector">
          <a-tag v-for="tag in availableTags" :key="tag" :class="{ selected: formState.tags.includes(tag) }"
            @click="toggleTag(tag)">
            {{ tag }}
          </a-tag>
        </div>
      </a-form-item>

      <a-form-item label="颜色选择" name="color">
        <div class="color-picker">
          <div v-for="color in colors" :key="color" class="color-item" :style="{ backgroundColor: color }"
            :class="{ selected: formState.color === color }" @click="selectColor(color)" />
        </div>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { message } from 'ant-design-vue';

interface IFormState {
  rating: number;
  priceRange: [number, number];
  tags: string[];
  color: string;
}
const formState = reactive<IFormState>({
  rating: 0,
  priceRange: [0, 500],
  tags: [],
  color: ''
});

const ratingTexts = ['很差', '差', '一般', '好', '很好'];

const availableTags = ['技术', '设计', '运营', '市场', '产品', '销售'];

const colors = ['#f5222d', '#fa8c16', '#fadb14', '#52c41a', '#1890ff', '#722ed1'];

const toggleTag = (tag: string) => {
  const index = formState.tags.indexOf(tag);
  if (index === -1) {
    formState.tags.push(tag);
  } else {
    formState.tags.splice(index, 1);
  }
};

const selectColor = (color: string) => {
  formState.color = color;
};

const onFinish = (values: any) => {
  console.log('表单数据:', values);
  message.success('提交成功！');
};
</script>

<style scoped>
.custom-rating {
  display: flex;
  align-items: center;
}

.rating-text {
  margin-left: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.price-range {
  padding: 0 12px;
}

.price-inputs {
  display: flex;
  align-items: center;
  margin-top: 12px;
}

.separator {
  margin: 0 8px;
}

.tag-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-selector .ant-tag {
  cursor: pointer;
  user-select: none;
}

.tag-selector .ant-tag.selected {
  background-color: #1890ff;
  color: #fff;
  border-color: #1890ff;
}

.color-picker {
  display: flex;
  gap: 12px;
}

.color-item {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.color-item:hover {
  transform: scale(1.1);
}

.color-item.selected {
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px #1890ff;
}
</style>
