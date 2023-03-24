<template>
  <div class="file-upload">
    <!-- 使用slot可以使得模板形式多样化 -->
    <div class="file-upload-container" @click.prevent="triggerUpload" v-bind="$attrs">
      <!-- 正在上传 -->
      <slot v-if="uploadStatus === 'loading'" name="loading">
        <button class="btn btn-primary" disabled>正在上传...</button>
      </slot>
      <!-- 上传成功 -- 显示上传的文件 -- 点击右上角的叉号会恢复初级状态 -- 即把 uploadStatus 改为ready -->
      <slot v-else-if="uploadStatus === 'success'" name="loaded" :fileData="fileData" :uploadStatus="uploadStatus">
        <button class="btn btn-primary">上传成功</button>
      </slot>
      <!-- 上传失败 -->
      <slot v-else-if="uploadStatus === 'error'" name="fillLoad">
        <button class="btn btn-primary">上传失败</button>
      </slot>
      <!-- 初级状态 -->
      <div v-else ref="uploadBtn" class="uploadBtn-container">
        <slot name="default">
          <button class="btn btn-primary">点击上传</button>
        </slot>
      </div>
      <!-- 当传输成功或者失败是显示 x 号，点击 x 恢复初始状态 -->
      <button type="button" class="btn-close" aria-label="Close" v-if="uploadStatus === 'success' || uploadStatus === 'error'" @click="initialStatus"></button>
    </div>
    <!-- 隐藏的输入框 -->
    <input type="file" class="file-input d-none" ref="fileInput" @change.prevent="handleFileChange">
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, watch } from 'vue'

// 引入请求
import { reqPostFile } from '@/request'

// 引入消息栏
import createMessage from '@/components/createMessage'

// 定义数据类型
type uploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckFunction = (file: File) => boolean

export default defineComponent({
  name: 'UploaderView',
  props: {
    action: { // 传入一个地址
      type: String,
      required: true
    },
    beforeUpload: { // 在上传文件之前先验证文件的格式
      type: Function as PropType<CheckFunction>
    },
    updatePosts: { // 需要更新数据
      type: Object
    }
  },
  inheritAttrs: false, // 取消样式的继承
  emits: ['file-uploaded', 'file-uploaded-error'], // 使用该组件需要传入上传成功和上传失败事件(感觉上传失败事件可以直接在该组件中直接写)
  setup (props, context) {
    // 存储获得的图片元素
    const fileData = ref()
    // 为了获取ref元素
    const fileInput = ref<null | HTMLInputElement>(null)
    const uploadBtn = ref<HTMLDivElement>()
    // 改变状态 -- 如果一开始有需要修改的数据传入，就是上传成功的一个状态
    const uploadStatus = ref<uploadStatus>(props.updatePosts ? 'success' : 'ready')

    watch(() => props.updatePosts, (newValue) => {
      if (newValue) {
        uploadStatus.value = 'success'
        fileData.value = newValue
      }
    })

    // 点击上传事件 -- 应该判断一下 事件的委派
    const triggerUpload = (e: Event) => {
      const target = e.target
      // 只有点击了上传的按钮才触发文件弹出框 -- 若不加则会点击该div下的所有属性都会弹出文件选择框
      if (uploadBtn.value && uploadBtn.value.contains(target as HTMLElement)) {
        if (fileInput.value) { // 如果此时已经取到了input元素
          // 用户点击对应的文件后会触发input框的change事件
          fileInput.value.click()
        }
      }
    }

    // input的change事件
    const handleFileChange = async (e: Event) => {
      const currentTarget = e.target as HTMLInputElement
      if (currentTarget.files) { // 表明用户已经选择了想要上传的文件
        const files = Array.from(currentTarget.files)

        // 在组织好格式之前，先检查一下上传的文件是否符合格式要求
        if (props.beforeUpload) { // 父组件中传入了格式检查方程才进行检查
          const result = props.beforeUpload(files[0])
          if (!result) {
            return // 格式不对直接返回
          }
        }

        // 说明格式没问题
        uploadStatus.value = 'loading'
        const formData = new FormData()
        formData.append('file', files[0])
        // 发送请求
        try {
          // 上传成功
          const result = await reqPostFile(props.action, formData)
          fileData.value = result.data // 将结果存储到响应式数据上，随后用作用域插槽递交给父组件
          uploadStatus.value = 'success'
          context.emit('file-uploaded', result.data)
        } catch (error) {
          // 上传失败
          uploadStatus.value = 'error'
          context.emit('file-uploaded-error', error)
        }
        // 无论上传失败与否，都重新置空上传框中的内容
        if (fileInput.value) {
          fileInput.value.value = ''
        }
      }
    }

    // 点击 x 返回初始状态
    const initialStatus = () => {
      uploadStatus.value = 'ready'
      createMessage('上传框已重置', 'default', 1500)
    }

    // 返回数据
    return { fileInput, uploadStatus, triggerUpload, handleFileChange, fileData, uploadBtn, initialStatus }
  }
})
</script>

<style scoped lang="less">
.file-upload-container{
  position: relative;
  .btn-close{
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
