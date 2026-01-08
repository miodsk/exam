import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite' // 💡 引入 loadEnv
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ mode }) => {
  // 💡 获取当前模式下的环境变量 (development/production)
  // process.cwd() 是项目根目录，'' 表示加载所有前缀为 VITE_ 的变量
  const env = loadEnv(mode, process.cwd())

  const baseURL = env.VITE_BASE_URL || 'http://localhost'
  const userPort = env.VITE_USER_PORT || '3001'
  const examPort = env.VITE_EXAM_PORT || '3002'

  return {
    plugins: [
      vue(),
      vueDevTools(),
      AutoImport({
        imports: ['vue'],
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        // 🚀 用户服务代理
        '/api/user': {
          target: `${baseURL}:${userPort}`,
          changeOrigin: true,
          // 💡 因为后端没有 /api，所以我们要把 '/api/user' 变成 '/user'
          rewrite: (path) => path.replace(/^\/api\/user/, '/user'),
        },
        // 🚀 考试服务代理
        '/api/exam': {
          target: `${baseURL}:${examPort}`,
          changeOrigin: true,
          // 💡 同理，把 '/api/exam' 变成 '/exam'
          rewrite: (path) => path.replace(/^\/api\/exam/, '/exam'),
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
