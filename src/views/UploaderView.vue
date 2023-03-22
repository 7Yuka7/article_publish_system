<template>
  <div>
    <h1>上传文章界面</h1>
    <button class="btn btn-primary" @click.prevent="triggerUpload">
      <span v-if="uploadStatus === 'loading'">正在上传...</span>
      <span v-else-if="uploadStatus === 'success'">上传成功！</span>
      <span v-else-if="uploadStatus === 'error'">上传失败！</span>
      <span v-else>点击上传</span>
    </button>
    <input type="file" class="file-input d-none" ref="fileInput" @change.prevent="handleFileChange">
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// 引入请求
import { reqPostFile } from '@/request'
// 定义数据类型
type uploadStatus = 'ready' | 'loading' | 'success' | 'error'
export default defineComponent({
  props: {
    action: { // 传入一个地址
      type: String,
      required: true
    }
  },
  setup () {
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
        uploadStatus.value = 'loading'
        const files = Array.from(currentTarget.files)
        const formData = new FormData()
        formData.append('file', files[0])
        // 发送请求
        try {
          // 上传成功
          await reqPostFile(formData)
          uploadStatus.value = 'success'
        } catch (error) {
          // 上传失败
          uploadStatus.value = 'error'
          console.log('发送文件请求失败', error)
        }
      }
    }
    return { fileInput, uploadStatus, triggerUpload, handleFileChange }
  }
})
</script>

<style scoped>

</style>
