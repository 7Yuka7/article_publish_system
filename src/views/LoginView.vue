<template>
  <ValidateForm @form-submit="onFormSubmit">
    <div class="mb-3">
      <label class="form-label">邮箱地址</label>
      <ValidateInput :rules="emailRules" v-model="emialValue" placeholder="请输入你的邮箱" type="text"></ValidateInput>
    </div>
    <div class="mb-3">
      <label class="form-label">密码</label>
      <ValidateInput :rules="passwordRules" v-model="passwordValue" placeholder="请输入你的密码" type="password"></ValidateInput>
    </div>
    <template #submit>
      <button type="submit" class="btn btn-primary w-100" :style="{ 'marginRight': '5px' }">Submit</button>
    </template>
    <template #clearInput>
      <button type="submit" class="btn btn-danger w-100">clear</button>
    </template>
  </ValidateForm>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
// 引入表单组件
import ValidateForm from '@/components/ValidateForm.vue'
// 引入input组件
import ValidateInput, { RuleProp } from '@/components/ValidateInput.vue'
// 引入消息栏组件
import createMessage from '@/components/createMessage'
// 引入路由
import { useRouter } from 'vue-router'
// 引入store
import { useStore } from 'vuex'

export default defineComponent({
  name: 'LoginForm',
  components: { ValidateInput, ValidateForm },
  setup () {
    // 路由 与 store的声明
    const router = useRouter()
    const store = useStore()
    // 双向数据绑定参数
    const emialValue = ref('')
    const passwordValue = ref('')

    // props数据验证
    const emailRules: RuleProp[] = [
      { type: 'required', message: '邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的邮箱地址' }
    ]
    const passwordRules: RuleProp[] = [
      { type: 'required', message: '密码不能为空' },
      { type: 'range', min: { length: 6, message: '密码应不少于6位，且不能含有空格' } },
      { type: 'range', max: { length: 16, message: '密码应不大于16位，且不能含有空格' } }
    ]

    // 提交按钮的监听事件 -- 转跳到首页
    const onFormSubmit = async (submit: boolean) => {
      // 如果验证通过 就跳转到路由 并修改store的格式（正常来讲的话应该是需要服务器返回数据的）-- 这个只是数据格式上的验证
      if (submit) {
        const playLoad = {
          email: emialValue.value,
          password: passwordValue.value
        }
        const result = await store.dispatch('postAndFtechUser', playLoad)
        // 如果有错误，result就会返回具体的错误信息
        if (typeof result !== 'string') {
          // 登录成功
          createMessage('登录成功，2s后转调至主页', 'success')
          setTimeout(() => {
            router.push('/')
          }, 2000)
        }
      }
    }

    return { emailRules, emialValue, passwordValue, passwordRules, onFormSubmit }
  }
})
</script>

<style scoped></style>
