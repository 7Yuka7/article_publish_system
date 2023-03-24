<template>
  <div class="vue-easymde-editor">
    <textarea ref="textArea"></textarea>
  </div>
</template>

<script setup lang="ts">
// 引入
import { defineProps, defineEmits, ref, onMounted, onUnmounted, defineExpose, watch } from 'vue'
import EasyMDE, { Options } from 'easymde' // 引入配置项

// 设定传入参数、方法格式
interface EditorProps {
  modelValue?: string,
  options?: Options
}

interface EditorEvents {
  (type: 'update:modelValue', value: string): void,
  (type: 'change', value: string): void,
  (type: 'blur'): void
}

// 定义props & emits
const props = defineProps<EditorProps>()
const emit = defineEmits<EditorEvents>()

// 拿去对应的textarea元素 -- 初始值为null
const textArea = ref<null | HTMLTextAreaElement>(null)
// easymde的实例对象
let easyMDEInstance: EasyMDE | null = null
// 初始值
const innerValue = ref(props.modelValue || '')

// 挂载的时候去获取对应的数值
onMounted(() => {
  if (textArea.value) {
    // 配置options
    const config: Options = {
      ...(props.options || {}), // 展开传入的配置项
      element: textArea.value, // 元素绑定
      initialValue: innerValue.value // 初始值
    }
    // 创建实例
    easyMDEInstance = new EasyMDE(config)
    // 监控对应事件 -- 查询该库了解更多
    // change方法
    easyMDEInstance.codemirror.on('change', () => {
      if (easyMDEInstance) {
        // 拿到当前的值
        const updatedValue = easyMDEInstance.value() // 库方法
        innerValue.value = updatedValue
        emit('update:modelValue', updatedValue) // 父子组件v-model事件
        emit('change', updatedValue) // change事件 -- 也是传入自定义事件
      }
    })
    // blur方法
    easyMDEInstance.codemirror.on('blur', () => {
      if (easyMDEInstance) {
        emit('blur')
      }
    })
  }
})
// 取消挂载的时候销毁对应的实例
onUnmounted(() => {
  if (easyMDEInstance) {
    easyMDEInstance.cleanup() // 取消挂载的方法
  }
  easyMDEInstance = null
})

// 暴露实例方法：
// 清空方法
const clear = () => {
  if (easyMDEInstance) {
    easyMDEInstance.value('')
  }
}
// 获取实例方法
const getMDEInstance = () => {
  return easyMDEInstance
}
// 暴露方法
defineExpose({
  clear,
  getMDEInstance
})

// 监视传入的值
watch(() => props.modelValue, (newValue) => {
  if (easyMDEInstance) {
    if (newValue !== innerValue.value) {
      easyMDEInstance.value(newValue || '')
    }
  }
})

</script>

<style scoped>
.is-invalid{
  border: red 1px solid;
}
</style>
