import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 1. 初始化变量
  const theme = ref(localStorage.getItem('theme') || 'light')

  // 2. 定义修改 HTML 类名的公共方法
  const updateHtmlClass = (val: string) => {
    const html = document.documentElement
    if (val === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  // 3. 💡 关键：使用 watch 自动处理副作用
  // 无论 theme 被谁改了，都会自动触发这里的逻辑
  watch(
    theme,
    (newVal) => {
      localStorage.setItem('theme', newVal)
      updateHtmlClass(newVal)
    },
    { immediate: true },
  ) // immediate 保证刷新页面时立即执行一次

  return { theme } // 连 toggleTheme 函数都不需要导出了
})
