<template>
  <div class="file-upload">
    <h1>上传文章界面</h1>
    <!-- 使用slot可以使得模板形式多样化 -->
    <div class="file-upload-container" @click.prevent="triggerUpload">
      <slot v-if="uploadStatus === 'loading'" name="loading">
        <button class="btn btn-primary" disabled>正在上传...</button>
      </slot>
      <slot v-else-if="uploadStatus === 'success'" name="loaded" :fileData="fileData">
        <button class="btn btn-primary">上传成功</button>
      </slot>
      <slot v-else-if="uploadStatus === 'error'" name="fillLoad">
        <button class="btn btn-primary">上传失败</button>
      </slot>
      <slot v-else name="default">
        <button class="btn btn-primary">点击上传</button>
      </slot>
    </div>
    <input type="file" class="file-input d-none" ref="fileInput" @change.prevent="handleFileChange">
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
// 引入请求
import { reqPostFile } from '@/request'
// 定义数据类型
type uploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckFunction = (file:File) => boolean
export default defineComponent({
  props: {
    action: { // 传入一个地址
      type: String,
      required: true
    },
    beforeUpload: { // 在上传文件之前先验证文件的格式
      type: Function as PropType<CheckFunction>
    }
  },
  emits: ['file-uploaded', 'file-uploaded-error'], // 使用该组件需要传入上传成功和上传失败事件(感觉上传失败事件可以直接在该组件中直接写)
  setup (props, context) {
    // 存储获得的图片元素
    const fileData = ref()
    // 为了获取ref元素
    const fileInput = ref<null | HTMLElement>(null)
    // 改变状态
    const uploadStatus = ref<uploadStatus>('ready')

    // 点击上传事件
    const triggerUpload = () => {
      if (fileInput.value) { // 如果此时已经取到了input元素
        fileInput.value.click() // 用户点击对应的文件后会触发input框的change事件
      }
    }

    // input的change事件
    const handleFileChange = async (e:Event) => {
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
          fileData.value = result.data
          uploadStatus.value = 'success'
          context.emit('file-uploaded', result.data)
        } catch (error) {
          // 上传失败
          uploadStatus.value = 'error'
          context.emit('file-uploaded-error', error)
        }
      }
    }
    return { fileInput, uploadStatus, triggerUpload, handleFileChange, fileData }
  }
})
</script>

<style scoped>

</style>
