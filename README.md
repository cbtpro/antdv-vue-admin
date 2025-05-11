---
theme: github
---
## 写在前面

本文旨在分享几种开发复杂表单的设计思想和实现方案，如果有没有覆盖涉及到的场景，欢迎评论补充。



## 常见表单种类：

简单表单
步骤式表单
分段表单
动态表单
表格表单
自定义表单

[一个简单的例子](https://play.vuejs.org/#eNrtV19vG0UQ/yrLvdiRwp0KPBBzsaAQRJGgFSB44Hg4+9bOlbvd092eSWVZSqAFVSKKEaQSKBGKiGgrVU2qpn/Tpl/Gd3a+RWd376/buE7UvsVPnp3fzuzM/GZ3rqt85HlqJ8RKTdGDpm97DAWYhV7dILbrUZ+hLvJxC/VQy6cuqgC0kqk+pb67YNmM+olW1fIlbrXygUEM0qQkYMgN2mie26pWPsOOQ9F31HestyozBtE16RqcgsCw6zkmwyAhpBd8aLCiawW1MquwAKy37LZ6MaAEgujyTYbSpK5nO9g/7zEbvBtKDQkN15ng/KfPxRrzQzybrjcXcfPHl6xfDJb4mqFc8HGA/Q42lEzHTL+NmVQvfP0lXoL/mdKlVugAeoLyKxxQJ+RnlLCzIbHg2AWcOO05kW+btL8JFpYYJkEaFD8oR/YE3lAg5x9PCD0/7rvqe2KfQXqQxbNmYDfPkRZNqVCuQcvGjgW0EBLIDm5jYtWjfx8Pt5YHz7bilR1dSxZTiNnATiIgFF3/M+qv1pBuEy9kqPM2RI+deUNxaNN0vuCCSkwXcoXYJQ+DgolsiZILe1rR4Lj1R3uHB5fHraskdBvYLzsx2wUfEnCEF10rRF1iHYhHdQqnXciwVWqXQg94PvUC6AILt2yCL3Cp+n1FHPdb0wHsDzOAlljs2iyDLoDAoaFnwSFq4zvSPXmksDM9TFWUH+peQ9UZNF+Xp1BzG4I7EAvoO1wWIO6++hJ/s0higDjcc6F1gUefYGbazrGJNNr5f7j/61RE2tiNNpcnE8m0LGhUIP5JuDT8695oZ3OyA2+RkumoekqiE5BI3HDWsUkUX70Z3VmfikRXbkVrDyfXmMdtkksnI9Fo5ffB01dcdx4NbHnvn/LozfDoPFvE/vEftSv3B/vXpqLR9m/x3RtQZV4408fmEe8aZXBZ1HnVJOy0vq+nvuVR88UCW3YnTfXiO/XR1o1odX345Nro4A9dg4VE1QIr6MMgbMARVM/HHUwYFFAucBdQu7TiejYnFUrNDagNrig0L2Dzt3AcbAlNGZ1feuNoYA1oyuiM2uNgyhVlbCNkjJL0kpFxQUzxWn/weFvXpDqDd7vcTg/mQslRLiUUlfmclp3jHw1QvkSXJzH9aCiNnwVkIYUptDxhFLCFBKbY8kNSwObpS6Glu6LYRIIe8rOlCwN0UmcYqUGQEysf26Pt69Haarx3AIM7n9n5lFlDc3Mwl4OY1lvuysYTsXFjd9j/Re5Kxgq+fOb9uTPJD4opjKQ0kEay50kYWXkw3FwePOrHG1cP/+6P9v4b7O/LRy6xnL01HB5v/nx450lqN2FMEpG4q2RE/HLjICRaL81H3heQFdnhouO5ljpYdWi7WpHcGv5zWTZdvL4br96uQTfzbHJrvbFm7j0HE3kkRw==)

### 分段表单

### 步骤式表单

步骤式表单（Step Form / Wizard Form）是一种将表单拆分为多个步骤、逐步引导用户填写的交互模式，常见于注册流程、信息采集、多段配置等场景。它具有以下特点：

- 分步骤进行: 将表单字段按照逻辑或流程划分成多个步骤（Step），每一步只展示当前相关的字段，避免信息过载。


- 用户体验好:用户更容易专注当前步骤，提高填写效率,提供“上一步 / 下一步”按钮，控制流程清晰明确

- 可视化进度:有步骤条（Step Bar）或进度条，可以直观看到当前进度和剩余步骤。

- 数据分阶段收集：每一步可以独立校验字段并缓存数据，最后统一提交，也可以分阶段提交（如：自动保存草稿）。

- 适合复杂或冗长表单：当表单内容过多（>5个字段以上），使用步骤式可大幅减轻用户心理压力。

注意事项

-   逻辑跳转复杂度增加：如果有条件判断跳转步骤，会增加实现和维护难度。
-   状态管理复杂：多步数据需统一保存和回传，推荐用状态管理工具（如 React 的 Context、Zustand、Vue 的 reactive）。
-   表单校验需分步处理：每一步需要局部校验，最终提交前需整体校验。

### 嵌套表单

### 动态表单

日期选择

日期范围选择
文件上传
表单校验
联合校验
表单重置


在 `ant-design-vue`（Antdv）中，`a-form` 表单校验通常会自动校验所有绑定字段，无论它们当前是否被禁用（`disabled`）——但如果你希望**在字段被禁用时不参与校验**，可以采用以下几种方式处理：

* * *

### ✅ **方式一：在 rules 中动态判断是否需要校验**

这种方式最灵活 —— 在字段的 `rules` 中加一个 `validator`，根据 `disabled` 状态跳过校验：

```
<a-form :model="form" :rules="rules" ref="formRef">
  <a-form-item label="用户名" name="username" :rules="getUsernameRules">
    <a-input v-model:value="form.username" :disabled="isDisabled" />
  </a-form-item>
</a-form>
```

```
const isDisabled = ref(true);

const getUsernameRules = computed(() => {
  if (isDisabled.value) {
    return []; // 禁用时不校验
  }
  return [
    { required: true, message: '请输入用户名' },
    { min: 3, message: '用户名至少 3 个字符' },
  ];
});
```

* * *

### ✅ **方式二：手动移除字段的 rules（或移除校验）**

当禁用字段时，可以直接动态移除 `rules`：

```
watch(isDisabled, (newVal) => {
  if (newVal) {
    rules.username = []; // 不校验
  } else {
    rules.username = [
      { required: true, message: '请输入用户名' },
    ];
  }
});
```

* * *

### ✅ **方式三：使用 `validateOnly` 选项手动控制校验字段**

如果你是通过 `formRef.value.validate()` 主动校验的，可以传入指定字段，避免校验禁用字段：

```
formRef.value.validate(['username', 'password']); // 只校验这两个字段
```

* * *

### ✅ **方式四：在 `rules` 中使用自定义 validator 判断是否校验**

```
const usernameRules = [
  {
    validator: (rule, value) => {
      if (isDisabled.value) return Promise.resolve();
      if (!value) return Promise.reject('请输入用户名');
      return Promise.resolve();
    },
  },
];
```

* * *

如果你使用的是较新版本的 `ant-design-vue`（v3+），建议搭配 `reactive` + `computed` 来动态控制 rules。



表单规则如果有多个规则重复，错误消息也会出现多次