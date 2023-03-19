import { createApp } from 'vue'
import App from './App.vue'
// 引入路由
import router from './router'
// 引入store
import store from './store'

createApp(App).use(router).use(store).mount('#app')
