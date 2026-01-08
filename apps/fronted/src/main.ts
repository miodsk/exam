import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'normalize.css'
import '../assets/main.css'
import pinia from './stores'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
