<template>
  <teleport to='#deleteModal'>
    <div class="modal d-block" tabindex="-1" v-if="visilbe">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"  @click.prevent="modalClose"></button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click.prevent="modalClose">取消</button>
            <button type="button" class="btn btn-primary" @click.prevent="modalConfirm">确认</button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useDOMCreate from '@/hooks/useDOMCreate'

export default defineComponent({
  name: 'ModalView',
  props: {
    visilbe: {
      type: Boolean,
      required: true,
      default: false
    },
    title: {
      type: String,
      required: true
    }
  },
  emits: ['modal-on-confirm', 'modal-on-close'],
  setup (props, context) {
    useDOMCreate('deleteModal')

    // 点击事件
    const modalClose = () => {
      context.emit('modal-on-close')
    }
    const modalConfirm = () => {
      context.emit('modal-on-confirm')
    }

    // 返回数据
    return { modalClose, modalConfirm }
  }
})
</script>

<style scoped></style>
