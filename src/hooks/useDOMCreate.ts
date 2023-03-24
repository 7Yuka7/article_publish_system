import { onUnmounted } from 'vue'

export default function useDOMCreate (nodeId:string) {
  // setup的执行时机在beforeMounted之前，因此可以操作DOM创建一个div
  const nodeCreate = document.createElement('div')
  nodeCreate.id = nodeId
  document.body.appendChild(nodeCreate)
  // 组件被销毁之前移除该节点
  onUnmounted(() => {
    document.body.removeChild(nodeCreate)
  })
}
