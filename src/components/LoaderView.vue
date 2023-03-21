<template>
  <teleport to='#back'>
    <div class="d-flex justify-content-center align-items-center h-100 loading-container"
      :style="{ backgroundColor: background || '' }">
      <div class="loading-content">
        <div class="spinner-border text-info" role="status">
          <span class="visually-hidden">{{ text || 'Loading...' }}</span>
        </div>
        <p v-if="text" class="text-info small">{{ text }}</p>
      </div>
    </div>
  </teleport>>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'

export default defineComponent({
  name: 'LoaderView',
  props: {
    text: {
      type: String
    },
    background: {
      type: String
    }
  },
  setup () {
    // setup的执行时机在beforeMounted之前，因此可以操作DOM创建一个div
    const node = document.createElement('div')
    node.id = 'back'
    document.body.appendChild(node)
    // 组件被销毁之前移除该节点
    onUnmounted(() => {
      document.body.removeChild(node)
    })
    return {}
  }
})
</script>

<style scoped lang="less">
.loading-container {
  background-color: rgba(255, 255, 255, .5);
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  text-align: center;
}
</style>
