<template>
  <div class="validate-input-container">
    <input v-if="tag !== 'textarea'" class="form-control" aria-describedby="emailHelp" :value="val" @blur="validateInput"
      :class="{ 'is-invalid': error }" @input="updateValue" v-bind="$attrs">
    <textarea v-else class="form-control"  :value="val" @blur="validateInput"
      :class="{ 'is-invalid': error }" @input="updateValue" v-bind="$attrs"></textarea>
    <span v-if="error" class="invalid-feedback">{{ message }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs, onMounted } from 'vue'
// 引入事件监听
import { emitter } from './ValidateForm.vue'
// 规则
export interface RuleProp {
  type: 'required' | 'email' | 'range',
  message?: string,
  min?: { length: number, message: string }
  max?: { length: number, message: string }
}

// 需要input还是textarea
export type TagType = 'input' | 'textarea'

export default defineComponent({
  name: 'ValidateInput',
  inheritAttrs: false,
  props: {
    // 传入的:rules应该是一个RuleProp类型的数组
    rules: {
      type: Array as PropType<RuleProp[]>
    },
    modelValue: String,
    // 判断是input框还是textarea,没传入就是默认input
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    }
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

    // 挂载的时候触发监听 -- 将验证方法传入
    onMounted(() => {
      emitter.emit('form-item-created', validateInput)
      // 清空方法也传入
      emitter.emit('form-item-clear', clearInput)
    })

    // 清空input的方法，该组件挂载的时候把这个回调函数调入
    const clearInput = () => {
      // 将input的值赋值为''即可
      inputRef.val = ''
    }

    return { ...toRefs(inputRef), validateInput, updateValue }
  }

})
</script>

<style scoped></style>
