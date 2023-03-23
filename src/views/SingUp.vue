<template>
  <div class="singup-container">
    <ValidateForm @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <ValidateInput :rules="emailRules" v-model="email" placeholder="请输入你的邮箱" type="text"></ValidateInput>
      </div>
      <div class="mb-3">
        <label class="form-label">昵称</label>
        <ValidateInput :rules="nickNameRules" v-model="nickName" placeholder="请输入你的昵称" type="text"></ValidateInput>
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <ValidateInput :rules="passwordRules" v-model="password" placeholder="请输入你的密码" type="password"></ValidateInput>
      </div>
      <div class="mb-3">
        <label class="form-label">重复密码</label>
        <ValidateInput :rules="repeatePasswordRules" v-model="repeatePassword" placeholder="请再次输入你的密码" type="password">
        </ValidateInput>
      </div>
      <template #submit>
        <button type="submit" class="btn btn-primary w-100" :style="{ 'marginRight': '5px' }">注册新用户</button>
      </template>
    </ValidateForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
// 引入表单组件
import ValidateForm from '@/components/ValidateForm.vue'
import ValidateInput, { RuleProp } from '@/components/ValidateInput.vue'
// 引入路由
import { useRouter } from 'vue-router'
// 引入axis发送请求 -- 不需要存储到仓库中因此不用谢action
import { reqPostSignup } from '@/request'
// 引入创建message组件的方法
import createMessage from '@/components/createMessage'
// 数据结构
interface SignypProps {
  email: string,
  nickName: string,
  password: string,
  repeatePassword?: string
}

export default defineComponent({
  name: 'SingUp',
  components: {
    ValidateForm,
    ValidateInput
  },
  setup () {
    const router = useRouter()
    // 初始值
    const singupInit = reactive<SignypProps>({
      email: '',
      nickName: '',
      password: '',
      repeatePassword: ''
    })

    // 各个表单的验证规则：
    const emailRules: RuleProp[] = [
      { type: 'required', message: '邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的邮箱地址' }
    ]
    const nickNameRules: RuleProp[] = [
      { type: 'required', message: '昵称不能为空' }
    ]
    const passwordRules: RuleProp[] = [
      { type: 'required', message: '密码不能为空' },
      { type: 'range', min: { length: 6, message: '密码应不少于6位，且不能含有空格' } },
      { type: 'range', max: { length: 16, message: '密码应不大于16位，且不能含有空格' } }
    ]
    const repeatePasswordRules: RuleProp[] = [
      { type: 'required', message: '重复密码不能为空' },
      { type: 'isIdentical', message: '两次输入密码不相同', isRepeate: () => singupInit.password === singupInit.repeatePassword }
    ]

    // 提交表单的操作
    const onFormSubmit = async (submit: boolean) => {
      // 输入内容无差错 -- 发送请求
      if (submit) {
        // 获取当前表单元素
        const playLoad: SignypProps = {
          email: singupInit.email,
          nickName: singupInit.nickName,
          password: singupInit.password
        }
        try {
          await reqPostSignup(playLoad)
          // 成功了显示成功的message，过两秒转跳到登录界面
          createMessage('注册成功 即将转跳至登陆界面', 'success', 2000)
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        } catch (error) {
          //  留在注册页面,并清空数据
        }
      }
    }
    return { ...toRefs(singupInit), emailRules, nickNameRules, passwordRules, repeatePasswordRules, onFormSubmit }
  }
})
</script>

<style scoped>
.singup-container {
  width: 40%;
  margin: auto;
  border: 3px solid rgba(0, 0, 0, 0.2);
  border-radius: 3%;
  margin-bottom: 15px;
  padding: 20px;
}
</style>
