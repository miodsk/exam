<script setup lang="ts">
import { useStore } from '@/stores'
import { ref, reactive, onUnmounted } from 'vue'
import { Api } from '@/api/userApi'
import {useRoute, useRouter} from 'vue-router'
const router = useRouter()

const api = new Api().user
const { user } = useStore()

// 切换状态：true为登录，false为注册
const isLogin = ref(true)

// 登录表单
const loginForm = reactive({
  username: '',
  password: '',
})

// 注册表单 - 包含所需的四个字段
const registerForm = reactive({
  username: '',
  password: '',
  email: '',
  captcha: '',
})

// 表单引用
const loginFormRef = ref()
const registerFormRef = ref()

// 加载状态
const loading = ref(false)

// 验证码冷却时间
const captchaCountdown = ref(0)
// 冷却定时器
let captchaTimer = null

// 登录方法
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()
    loading.value = true
    await user.login(loginForm)
    ElMessage.success('登录成功')
    router.push({path: '/'})
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}

// 注册方法
const handleRegister = async () => {
  if (!registerFormRef.value) return

  try {
    await registerFormRef.value.validate()
    loading.value = true
    // TODO: 实现注册API调用
    console.log('注册信息:', registerForm)
    // 注册成功后切换到登录
    const res = await api.userControllerRegister(registerForm)
    isLogin.value = true
    // 清空表单
    Object.assign(registerForm, { username: '', password: '', email: '', captcha: '' })
  } catch (error) {
    console.error('注册失败:', error)
  } finally {
    loading.value = false
  }
}

// 切换登录/注册
const toggleMode = () => {
  isLogin.value = !isLogin.value
  // 切换时清空表单验证
  if (loginFormRef.value) loginFormRef.value.clearValidate()
  if (registerFormRef.value) registerFormRef.value.clearValidate()
}

// 获取验证码方法
const getCaptcha = async () => {
  if (!registerFormRef.value) return

  try {
    // 验证邮箱格式
    await registerFormRef.value.validateField('email')

    // TODO: 实现获取验证码API调用
    console.log('获取验证码，邮箱:', registerForm.email)
    await api.userControllerCaptcha({ address: registerForm.email })

    // 开始60秒冷却
    startCaptchaCountdown()
  } catch (error) {
    console.error('邮箱验证失败:', error)
  }
}

// 开始验证码倒计时
const startCaptchaCountdown = () => {
  // 清除之前的定时器
  if (captchaTimer) {
    clearInterval(captchaTimer)
    captchaTimer = null
  }

  // 设置冷却时间为60秒
  captchaCountdown.value = 60

  // 开始倒计时
  captchaTimer = setInterval(() => {
    captchaCountdown.value--

    // 倒计时结束
    if (captchaCountdown.value <= 0) {
      clearInterval(captchaTimer)
      captchaTimer = null
      captchaCountdown.value = 0
    }
  }, 1000)
}

// 组件卸载时清理定时器
onUnmounted(() => {
  if (captchaTimer) {
    clearInterval(captchaTimer)
    captchaTimer = null
  }
})
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <!-- 登录/注册切换标签 -->
      <div class="login-tabs">
        <div class="tab-item" :class="{ active: isLogin }" @click="toggleMode">登录</div>
        <div class="tab-item" :class="{ active: !isLogin }" @click="toggleMode">注册</div>
      </div>

      <!-- 头部标题 -->
      <div class="login-header">
        <h2 class="login-title">考试系统</h2>
        <p class="login-subtitle">
          {{ isLogin ? '请登录您的账户' : '创建新账户' }}
        </p>
      </div>

      <!-- 登录表单 -->
      <el-form
        v-if="isLogin"
        :model="loginForm"
        class="login-form"
        :rules="{
          username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        }"
        ref="loginFormRef"
      >
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名"
            v-model="loginForm.username"
            prefix-icon="User"
            size="large"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="loginForm.password"
            prefix-icon="Lock"
            show-password
            size="large"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="handleLogin"
            class="login-button"
            size="large"
            :loading="loading"
          >
            登录
          </el-button>
        </el-form-item>

        <div class="login-footer">
          <el-link type="primary" :underline="false">忘记密码?</el-link>
        </div>
      </el-form>

      <!-- 注册表单 -->
      <el-form
        v-else
        :model="registerForm"
        class="login-form"
        :rules="{
          username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
          ],
          captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        }"
        ref="registerFormRef"
      >
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名"
            v-model="registerForm.username"
            prefix-icon="User"
            size="large"
          ></el-input>
        </el-form-item>

        <el-form-item prop="email">
          <el-input
            placeholder="请输入邮箱"
            v-model="registerForm.email"
            prefix-icon="Message"
            size="large"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="registerForm.password"
            prefix-icon="Lock"
            show-password
            size="large"
          ></el-input>
        </el-form-item>

        <el-form-item prop="captcha">
          <div class="captcha-container">
            <el-input
              placeholder="请输入验证码"
              v-model="registerForm.captcha"
              prefix-icon="Key"
              size="large"
              class="captcha-input"
            ></el-input>
            <el-button
              type="default"
              @click="getCaptcha"
              class="captcha-button"
              size="large"
              :disabled="captchaCountdown > 0"
            >
              {{ captchaCountdown > 0 ? `${captchaCountdown}秒后重试` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="handleRegister"
            class="login-button"
            size="large"
            :loading="loading"
          >
            注册
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 40px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  }
}

// 登录/注册切换标签
.login-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;

  .tab-item {
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    color: #606266;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
      color: #667eea;
    }

    &.active {
      color: #667eea;

      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
    }
  }
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.login-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.login-form {
  width: 100%;
}

.login-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  border-radius: 8px;
}

.login-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  font-size: 14px;
}

// 验证码容器
.captcha-container {
  display: flex;
  gap: 12px;

  .captcha-input {
    flex: 1;
  }

  .captcha-button {
    width: 120px;
    border-radius: 8px;
  }
}

// 调整表单项间距
:deep(.el-form-item) {
  margin-bottom: 20px;
}

// 调整输入框样式
:deep(.el-input__wrapper) {
  border-radius: 8px;

  &:hover {
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }

  &.is-focus {
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.4);
  }
}

// 调整按钮样式
:deep(.el-button--primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;

  &:hover {
    background: linear-gradient(135deg, #5a6fd8 0%, #6a408e 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
}

// 调整默认按钮样式
:deep(.el-button--default) {
  border-radius: 8px;

  &:hover {
    border-color: #667eea;
    color: #667eea;
  }
}
</style>
