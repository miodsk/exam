// src/stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Api, type User, type LoginUserDto } from '@/api/userApi' // 引入生成的类和类型
import router from '@/router'

// 实例化生成的 API
const userApi = new Api()

export const useUserStore = defineStore(
  'user',
  () => {
    // --- State ---
    const token = ref<string>(localStorage.getItem('token') || '')
    const userInfo = ref<User | null>(null)

    // --- Getters ---
    const isLoggedIn = computed(() => !!token.value)
    const isAdmin = computed(() => userInfo.value?.username === 'admin') // 举例权限逻辑

    // --- Actions ---

    // 1. 登录
    const login = async (loginDto: LoginUserDto) => {
      // 调用生成的接口
      // 注意：根据之前的分析，此处 res 是拆箱后的 LoginVo { user, token }
      const res = await userApi.user.userControllerUserLogin(loginDto)

      // 保存到状态机
      token.value = res.token
      userInfo.value = res.user

      // 持久化存储，防止刷新页面丢失
      localStorage.setItem('token', res.token)

      return res
    }

    // 2. 登出
    const logout = () => {
      token.value = ''
      userInfo.value = null
      localStorage.removeItem('token')
      // 跳转到登录页
      router.push('/login')
    }

    // 3. 校验 Token 并获取/刷新用户信息
    const fetchUserInfo = async (username: string) => {
      if (!token.value) return
      try {
        const res = await userApi.user.userControllerGetUserInfo({ username })
        userInfo.value = res as unknown as User
      } catch (err) {
        // 如果 Token 过期，Actions 会被 request.ts 拦截并处理
        console.error('获取用户信息失败', err)
      }
    }

    return {
      token,
      userInfo,
      isLoggedIn,
      isAdmin,
      login,
      logout,
      fetchUserInfo,
    }
  },
  {
    // 💡 开启 Pinia 持久化插件（需要安装 pinia-plugin-persistedstate）
    persist: true,
  },
)
