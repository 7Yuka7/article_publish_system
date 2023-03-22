// 引入创建方法
import { h, render } from 'vue'
// 引入组件
import MessageViewVue from './MessageView.vue'
// 数据类型
type MessageType = 'success' | 'error' | 'default'

// 创建组件的一个函数方法
const createMessage = (message: string, type: MessageType, timeout?: number) => {
  // 使用h函数生成Vnode
  const MessageInstance = h(MessageViewVue, {
    message,
    type
  })

  // 生成Vnode节点需要挂载的DOM节点
  const node = document.createElement('div')
  document.body.appendChild(node)
  render(MessageInstance, node)

  // 给出一个手动取消挂载的方法 -- 如果传入了一个timeout的时候则直接调用定时器即可
  const destory = () => {
    // 消失之前：1.取消实例的挂载2.取消创建的节点
    render(null, node)
    document.body.removeChild(node)
  }
  if (timeout) {
    // 一定时间后消息消失
    setTimeout(() => {
      destory()
    }, timeout)
  }

  // 将实例方法给出
  return { destory }
}

export default createMessage
