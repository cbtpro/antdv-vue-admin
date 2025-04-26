<script setup lang="ts">
import { ref } from 'vue'
import {
  UserOutlined,
  MessageOutlined,
  SolutionOutlined,
  TeamOutlined
} from '@ant-design/icons-vue'

const statistics = ref([
  { title: '活跃用户', value: '1,128', icon: UserOutlined, color: '#1890ff' },
  { title: '系统消息', value: '93', icon: MessageOutlined, color: '#52c41a' },
  { title: '工单数量', value: '56', icon: SolutionOutlined, color: '#faad14' },
  { title: '团队成员', value: '8', icon: TeamOutlined, color: '#722ed1' }
])

const announcements = ref([
  { title: '系统更新通知', date: '2024-03-20', content: '系统将于本周六进行例行维护更新' },
  { title: '新功能发布', date: '2024-03-18', content: '表单构建器功能已上线' },
  { title: '团队会议', date: '2024-03-15', content: '下周一上午10点全体会议' }
])
</script>

<template>
  <div class="home-container">
    <a-row :gutter="16">
      <a-col :span="6" v-for="stat in statistics" :key="stat.title">
        <a-card>
          <template #extra>
            <component :is="stat.icon" :style="{ color: stat.color, fontSize: '24px' }" />
          </template>
          <a-statistic :title="stat.title" :value="stat.value" />
        </a-card>
      </a-col>
    </a-row>

    <a-card title="系统公告" style="margin-top: 16px">
      <a-list :data-source="announcements">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta
              :title="item.title"
              :description="item.content"
            >
              <template #extra>{{ item.date }}</template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-card>

    <a-row :gutter="16" style="margin-top: 16px">
      <a-col :span="24">
        <a-card title="快速入口">
          <a-space>
            <a-button type="primary">创建工单</a-button>
            <a-button>查看报表</a-button>
            <a-button>团队管理</a-button>
            <a-button>系统设置</a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.home-container {
  padding: 24px;
  background: #f0f2f5;
  min-height: 100%;
}
</style>