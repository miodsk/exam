import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite' // 💡 引入 loadEnv
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// ... 前面的 import 保持不变

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  const baseURL = env.VITE_BASE_URL || 'http://localhost'
  const userPort = env.VITE_USER_PORT || '3001'
  const examPort = env.VITE_EXAM_PORT || '3002'
  const answerPort = env.VITE_ANSWER_PORT || '3003'
  const analysePort = env.VITE_ANALYSE_PORT || '3004'

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
      // ⬇️ 新增 HMR 配置解决 1006 报错
      hmr: {
        host: '5ed55280.r35.cpolar.top', // 你的公网域名
        clientPort: 443, // Cpolar HTTPS 默认端口
        protocol: 'wss', // 必须使用加密的 WebSocket
      },
      proxy: {
        '/api/user': {
          target: `${baseURL}:${userPort}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/user/, '/user'),
        },
        '/api/exam': {
          target: `${baseURL}:${examPort}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/exam/, '/exam'),
        },
        '/api/answer': {
          target: `${baseURL}:${answerPort}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/answer/, '/answer'),
        },
        '/api/analyse': {
          target: `${baseURL}:${analysePort}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/analyse/, '/analyse'),
        },
      },
      allowedHosts: ['5ed55280.r35.cpolar.top', 'localhost'],
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
