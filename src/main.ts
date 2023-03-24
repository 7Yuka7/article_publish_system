import { createApp } from 'vue'
import App from './App.vue'
// 引入路由
import router from './router'
// 引入store
import store from './store'
// 引入markdwon编辑器样式
import 'easymde/dist/easymde.min.css'

createApp(App).use(router).use(store).mount('#app')
