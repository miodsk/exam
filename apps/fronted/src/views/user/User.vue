<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useStore } from '@/stores'
import { Api } from '@/api/examApi'
import { ElMessage } from 'element-plus'
import { Logout, Moon, Sunny } from '@element-plus/icons-vue'

const { user, app } = useStore()
const api = new Api().exam

// 用户信息
const userInfo = user.userInfo

// 考试列表
const examList = ref([])

// 修改密码对话框
const passwordDialogVisible = ref(false)

// 修改密码表单
const passwordForm = reactive({
  email: userInfo?.email || '',
  username: userInfo?.username || '',
  password: '',
  captcha: '',
  captchaCountdown: 0,
})

// 获取用户创建的考试列表
const getExamList = async () => {
  if (!userInfo) return
  try {
    const res = await api.examControllerList({ bin: 'false' })
    // 过滤出当前用户创建的考试
    examList.value = res.filter((exam: any) => exam.createUserId === userInfo.id)
  } catch (error) {
    ElMessage.error('获取考试列表失败')
    console.error(error)
  }
}

// 发送验证码
const sendCaptcha = async () => {
  if (!passwordForm.email) {
    ElMessage.warning('请输入邮箱')
    return
  }

  try {
    // 调用API发送验证码
    await api.examControllerSendCaptcha({ address: passwordForm.email })
    ElMessage.success('验证码发送成功')

    // 开始倒计时
    passwordForm.captchaCountdown = 60
    const timer = setInterval(() => {
      passwordForm.captchaCountdown--
      if (passwordForm.captchaCountdown <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    ElMessage.error('验证码发送失败')
    console.error(error)
  }
}

// 提交修改密码
const submitPassword = async () => {
  try {
    // 调用API修改密码
    await api.examControllerUpdatePassword(passwordForm)
    ElMessage.success('密码修改成功')
    passwordDialogVisible.value = false
    // 重置表单
    passwordForm.password = ''
    passwordForm.captcha = ''
  } catch (error) {
    ElMessage.error('密码修改失败')
    console.error(error)
  }
}

// 登出
const logout = () => {
  userStore.logout()
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString()
}

// 组件挂载时获取考试列表
onMounted(() => {
  getExamList()
})
</script>

<template>
  <div class="user-container">
    <h1 class="page-title">个人中心</h1>

    <div class="user-content">
      <!-- 用户信息卡片 -->
      <el-card class="user-info-card">
        <template #header>
          <div class="card-header">
            <span>用户信息</span>
            <div class="header-right">
              <el-switch
                v-model="app.theme"
                active-value="dark"
                inactive-value="light"
                inline-prompt
                :active-icon="Moon"
                :inactive-icon="Sunny"
                class="theme-switch"
              />
              <el-button type="danger" size="small" icon="Logout" @click="logout">
                退出登录
              </el-button>
            </div>
          </div>
        </template>

        <div class="user-info">
          <div class="info-item">
            <label>用户名：</label>
            <span>{{ userInfo?.username }}</span>
          </div>
          <div class="info-item">
            <label>邮箱：</label>
            <span>{{ userInfo?.email }}</span>
          </div>
          <div class="info-item">
            <label>注册时间：</label>
            <span>{{ userInfo?.createTime ? formatDate(userInfo.createTime) : '' }}</span>
          </div>
          <div class="info-item">
            <label>最近登录：</label>
            <span>{{ userInfo?.updateTime ? formatDate(userInfo.updateTime) : '' }}</span>
          </div>
          <div class="info-item">
            <el-button type="primary" size="small" @click="passwordDialogVisible = true">
              修改密码
            </el-button>
          </div>
        </div>
      </el-card>

      <!-- 我的考试列表 -->
      <el-card class="exam-list-card">
        <template #header>
          <div class="card-header">
            <span>我的考试</span>
          </div>
        </template>

        <div v-if="examList.length === 0" class="empty-exam">
          <el-empty description="暂无创建的考试" />
        </div>

        <el-table v-else :data="examList" stripe style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="考试名称" />
          <el-table-column prop="isPublish" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.isPublish ? 'success' : 'info'">
                {{ scope.row.isPublish ? '已发布' : '未发布' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="200">
            <template #default="scope">
              {{ formatDate(scope.row.createTime) }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="passwordDialogVisible" title="修改密码" width="500px">
      <el-form :model="passwordForm" label-width="120px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="passwordForm.username" disabled />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="passwordForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <div class="captcha-input">
            <el-input v-model="passwordForm.captcha" placeholder="请输入验证码" />
            <el-button
              type="primary"
              @click="sendCaptcha"
              :disabled="passwordForm.captchaCountdown > 0"
            >
              {{
                passwordForm.captchaCountdown > 0
                  ? `${passwordForm.captchaCountdown}秒后重新发送`
                  : '发送验证码'
              }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="passwordForm.password" type="password" placeholder="请输入新密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPassword">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.user-container {
  height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--main-bg);

  .page-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    color: var(--text-primary);
  }

  .user-content {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 20px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .user-info-card,
  .exam-list-card {
    background-color: var(--bg-card);
    box-shadow: var(--shadow-sm);

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      color: var(--text-primary);
    }
  }

  .user-info-card {
    .card-header {
      .header-right {
        display: flex;
        align-items: center;
        gap: 15px;
      }
    }

    .user-info {
      .info-item {
        display: flex;
        align-items: center;
        margin-bottom: 15px;

        label {
          width: 80px;
          font-weight: 500;
          color: var(--text-secondary);
        }

        span {
          color: var(--text-primary);
        }
      }
    }
  }

  .exam-list-card {
    .empty-exam {
      padding: 40px 0;
      text-align: center;
    }
  }

  .captcha-input {
    display: flex;
    gap: 10px;

    .el-input {
      flex: 1;
    }
  }
}
</style>
