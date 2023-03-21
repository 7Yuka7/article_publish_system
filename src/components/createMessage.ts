// 引入创建方法
import { createApp } from 'vue'
// 引入组件
import MessageViewVue from './MessageView.vue'
// 数据类型
type MessageType = 'success' | 'error' | 'default'
const createMessage = (message: string, type: MessageType, timeout = 2000) => {
  const MessageInstance = createApp(MessageViewVue, {
    message,
    type
  })
  const node = document.createElement('div')
  document.body.appendChild(node)
  MessageInstance.mount(node)
  // 一定时间后消息消失
  setTimeout(() => {
    // 消失之前：1.取消实例的挂载2.取消创建的节点
    MessageInstance.unmount()
    document.body.removeChild(node)
  }, timeout)
}

export default createMessage
