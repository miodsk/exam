<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '@/stores'
// 💡 必须从图标库中导入这两个组件
import { Moon, Sunny, Avatar, Tickets, DocumentChecked } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const toAvatar = () => {
  router.push('/user')
}
const toExam = () => {
  router.push('/examList')
}
const toRecord = () => {
  router.push('/record')
}
const { app, user } = useStore()
</script>

<template>
  <div id="nav-container">
    <div class="logo">问卷星</div>
    <div class="icon-box">
      <el-icon @click="toAvatar">
        <Avatar />
      </el-icon>
      <el-icon @click="toExam">
        <Tickets />
      </el-icon>
      <el-icon @click="toRecord">
        <DocumentChecked />
      </el-icon>
    </div>
    <div class="right-box">
      <el-switch
        v-model="app.theme"
        active-value="dark"
        inactive-value="light"
        inline-prompt
        :active-icon="Moon"
        :inactive-icon="Sunny"
        class="theme-switch"
      />
      <div class="user-name">欢迎，{{ user.userInfo?.username }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#nav-container {
  height: 4rem; // 💡 6rem 有点过高，建议 4rem 左右
  display: flex;
  align-items: center;
  justify-content: space-between; // 💡 左右两端对齐
  padding: 0 40px;
  background-color: var(--nav-bg);
  color: var(--text-primary);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  .icon-box {
    display: flex;
    align-items: center;
    gap: 20px; // 图标之间的间距
    font-size: 20px;
    color: var(--text-primary);

    :deep(.el-icon) {
      font-size: 24px; // 修改图标大小
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 8px;
      border-radius: 50%;
      color: var(--text-primary); // 确保变量已定义

      &:hover {
        color: var(--el-color-primary) !important; // 使用 Element Plus 默认主色变量
        transform: scale(1.1);
        background-color: var(--el-input-color-light);
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }

  .right-box {
    display: flex;
    align-items: center;
    gap: 20px; // 图标和名字之间的间距
    color: var(--text-primary);

    .user-name {
      font-size: 16px;
      font-weight: normal;
      color: var(--text-primary);
    }
  }
}
</style>
