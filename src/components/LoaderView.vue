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
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// 创建节点钩子函数
import useDOMCreate from '@/hooks/useDOMCreate'

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
    useDOMCreate('back')
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
