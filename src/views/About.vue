<script setup lang="ts">
import { GithubOutlined, TwitterOutlined, LinkedinOutlined } from '@ant-design/icons-vue'

const teamMembers = [
  {
    name: '张三',
    title: '前端开发工程师',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: '专注于Vue.js和React开发，有5年+工作经验'
  },
  {
    name: '李四',
    title: 'UI设计师',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: '负责产品的用户界面设计，追求极致的用户体验'
  },
  {
    name: '王五',
    title: '产品经理',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: '具有丰富的产品规划和团队管理经验'
  }
]
</script>

<template>
  <div class="about-container">
    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        <a-card title="关于我们">
          <p>这是一个基于 Vue 3 + Ant Design Vue 的后台管理系统模板，采用了最新的前端技术栈。</p>
          <a-divider />
          <h3>技术栈</h3>
          <a-descriptions>
            <a-descriptions-item label="前端框架">Vue 3</a-descriptions-item>
            <a-descriptions-item label="UI组件库">Ant Design Vue</a-descriptions-item>
            <a-descriptions-item label="构建工具">Vite</a-descriptions-item>
            <a-descriptions-item label="开发语言">TypeScript</a-descriptions-item>
            <a-descriptions-item label="路由管理">Vue Router</a-descriptions-item>
            <a-descriptions-item label="代码规范">ESLint</a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>

      <a-col :span="24">
        <a-card title="团队成员">
          <a-row :gutter="[16, 16]">
            <a-col :span="8" v-for="member in teamMembers" :key="member.name">
              <a-card hoverable>
                <template #cover>
                  <img :alt="member.name" :src="member.avatar" />
                </template>
                <a-card-meta :title="member.name" :description="member.title">
                  <template #description>
                    <p>{{ member.description }}</p>
                  </template>
                </a-card-meta>
              </a-card>
            </a-col>
          </a-row>
        </a-card>
      </a-col>

      <a-col :span="24">
        <a-card title="联系我们">
          <a-space>
            <a-button type="primary" href="https://github.com" target="_blank">
              <template #icon><GithubOutlined /></template>
              GitHub
            </a-button>
            <a-button href="https://twitter.com" target="_blank">
              <template #icon><TwitterOutlined /></template>
              Twitter
            </a-button>
            <a-button type="primary" href="https://linkedin.com" target="_blank">
              <template #icon><LinkedinOutlined /></template>
              LinkedIn
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.about-container {
  padding: 24px;
  background: #f0f2f5;
  min-height: 100%;
}

.ant-card-meta-description {
  margin-top: 8px;
}
</style>