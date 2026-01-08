import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useUserStore } from './user'
import { useAppStore } from '@/stores/app.ts'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export const useStore = () => {
  return {
    user: useUserStore(),
    app: useAppStore(),
  }
}
export default pinia
