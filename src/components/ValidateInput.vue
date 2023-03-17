<template>
  <div class="validate-input-container">
    <input class="form-control" aria-describedby="emailHelp" :value="val" @blur="validateInput"
      :class="{ 'is-invalid': error }" @input="updateValue" v-bind="$attrs">

    <span v-if="error" class="invalid-feedback">{{ message }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs, onMounted } from 'vue'
// 引入事件监听
import { emitter } from './ValidateForm.vue'

export interface RuleProp {
  type: 'required' | 'email' | 'range',
  message?: string,
  min?: { length: number, message: string }
  max?: { length: number, message: string }
}

export default defineComponent({
  name: 'ValidateInput',
  inheritAttrs: false,
  props: {
    // 传入的:rules应该是一个RuleProp类型的数组
    rules: {
      type: Array as PropType<RuleProp[]>
    },
    modelValue: String
  },
  setup (props, context) {
    // 验证邮箱的正则表达式
    const emialReg = /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/
    // 设置初始值
    const inputRef = reactive({
      val: props.modelValue || '',
      error: false,
      message: ''
    })
    // 手动实现v-model
    const updateValue = (e: Event) => {
      const targetValue = (e.target as HTMLInputElement).value
      inputRef.val = targetValue
      context.emit('update:modelValue', targetValue)
    }

    // 验证输入
    const validateInput = () => {
      // 循环props验证规则
      if (props.rules) {
        // 使用every数组方法，只有当返回值都为true时，allPassed才为true
        const allPassed = props.rules.every(rule => {
          // 临时的flag
          let passed = true
          inputRef.message = rule.message || ''
          switch (rule.type) {
            case 'required':
              passed = inputRef.val.trim() !== ''
              break
            case 'email':
              passed = emialReg.test(inputRef.val)
              break
            case 'range': {
              // 解构--此处要包裹在块作用域中，因为switch不允许在case中申明变量
              const { min, max } = rule
              if (min && inputRef.val.length < min.length) {
                passed = false
                inputRef.message = min.message
              }
              if (max && inputRef.val.length > max.length) {
                passed = false
                inputRef.message = max.message
              }
              break
            }

            default:
              break
          }
          return passed
        })
        // 当验证没有通过即allPassed为false时，说明有错误，显示error
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }

    // 挂载的时候触发监听
    onMounted(() => {
      emitter.emit('form-item-created', validateInput)
    })
    return { ...toRefs(inputRef), validateInput, updateValue }
  }
})
</script>

<style scoped></style>
