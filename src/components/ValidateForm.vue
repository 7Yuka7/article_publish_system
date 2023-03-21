<template>
  <form class="validate-form-container">
    <slot></slot>
    <div class="option-container">
      <div class="submit-area" @click.prevent="submitForm">
        <slot name="submit">
          <button type="submit" class="btn btn-primary">登录</button>
        </slot>
      </div>
      <div class="clear-area" @click.prevent="clearInputs">
        <slot name="clearInput">
          <button type="submit" class="btn btn-primary">清空</button>
        </slot>
      </div>
    </div>

  </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
// 引入监听器,并创建对象
import mitt from 'mitt'
// 监听函数的类型
type ValidateFunc = () => boolean
type ClearFunc = () => void
// 监听事件的类型
type Events = {
  'form-item-created': ValidateFunc,
  'form-item-clear':ClearFunc
}
export const emitter = mitt<Events>()

export default defineComponent({
  name: 'ValidateForm',
  // 自定义事件的传入
  emits: ['form-submit'],
  setup (props, context) {
    // 函数数组中存放的应该是各个input的验证方法
    let funcArr: ValidateFunc[] = []
    let clearArr: ClearFunc[] = []

    // 点击提交的时候，循环调用数组中的方法
    const submitForm = () => {
      // 一个一个验证input的合法性，全部合法就为true
      const result = funcArr.map(func => func()).every(result => result)
      context.emit('form-submit', result)
    }

    // 监听器发布事件以及组件消失时取消事件的监听
    const callback = (func: ValidateFunc) => {
      // 将收到的方法放入数组中
      funcArr.push(func)
    }
    // 清空方法
    const clearCallback = (func:ClearFunc) => {
      clearArr.push(func)
    }
    // 监听到对应的事件就调用callback
    emitter.on('form-item-created', callback)
    emitter.on('form-item-clear', clearCallback)
    // 取消事件的监听
    onUnmounted(() => {
      emitter.off('form-item-created', callback)
      emitter.off('form-item-clear', clearCallback)
      // 取消挂载的时候清空数组
      funcArr = []
      clearArr = []
    })

    // 清空输入框事件
    const clearInputs = () => {
      // 点击就给Input里面的值全部清空
      clearArr.forEach(func => func())
    }

    return { submitForm, clearInputs }
  }
})
</script>

<style scoped lang="less">
.option-container{
  display: flex;
}
</style>
