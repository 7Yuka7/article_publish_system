<template>
  <ValidateForm @form-submit="onFormSubmit">
    <div class="mb-3">
      <label class="form-label">邮箱地址</label>
      <ValidateInput
      :rules="emailRules"
      v-model="emialValue"
      placeholder="请输入你的邮箱"
      type="text"
      ></ValidateInput>
    </div>
    <div class="mb-3">
      <label class="form-label">密码</label>
      <ValidateInput
      :rules="passwordRules"
      v-model="passwordValue"
      placeholder="请输入你的密码"
      type="password"
      ></ValidateInput>
    </div>
    <template #submit>
      <button type="submit" class="btn btn-danger">Submit</button>
    </template>
  </ValidateForm>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
// 引入组件
import ValidateForm from './ValidateForm.vue'
// 引入input组件
import ValidateInput, { RuleProp } from './ValidateInput.vue'

export default defineComponent({
  name: 'LoginForm',
  components: { ValidateInput, ValidateForm },
  setup () {
    // 双向数据绑定参数
    const emialValue = ref('')
    const passwordValue = ref('')
    // props数据
    const emailRules:RuleProp[] = [
      { type: 'required', message: '邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的邮箱地址' }
    ]
    const passwordRules:RuleProp[] = [
      { type: 'required', message: '密码不能为空' },
      { type: 'range', min: { length: 6, message: '密码应不少于6位，且不能含有空格' } },
      { type: 'range', max: { length: 16, message: '密码应不大于16位，且不能含有空格' } }
    ]
    // 提交按钮的监听事件
    const onFormSubmit = (submit:boolean) => {
      console.log('1234', submit)
    }

    return { emailRules, emialValue, passwordValue, passwordRules, onFormSubmit }
  }
})
</script>

<style scoped></style>
