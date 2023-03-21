<template>
  <div>
    <ValidateForm @form-submit="onFormSubmit">
      <div class="mb-3">
      <label class="form-label">文章标题</label>
      <ValidateInput
      :rules="titleRules"
      v-model="titleValue"
      placeholder="请输入文章标题"
      type="text"
      ></ValidateInput>
    </div>
    <div class="mb-3">
      <label class="form-label">文章详情</label>
      <ValidateInput
      :rules="paperRules"
      v-model="paperValue"
      placeholder="请输入文章详情"
      type="text"
      tag='textarea'
      rows="10"
      ></ValidateInput>
    </div>
    <template #submit>
      <button type="submit" class="btn btn-primary" :style="{'marginRight':'5px'}">发表文章</button>
    </template>
    <template #clearInput>
      <button type="submit" class="btn btn-danger">清空内容</button>
    </template>
    </ValidateForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// 组件复用
import ValidateForm from '@/components/ValidateForm.vue'
import ValidateInput, { RuleProp } from '@/components/ValidateInput.vue'

// 引入路由和仓库
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
// 引入数据格式
import { GlobalDataProps, IPostData } from '@/store/index'

export default defineComponent({
  name: 'CreatePost',
  components: {
    ValidateForm,
    ValidateInput
  },
  setup () {
    const router = useRouter()
    const store = useStore<GlobalDataProps>()
    // title数据验证以及双向绑定
    const titleValue = ref('')
    const titleRules:RuleProp[] = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    // paper数据验证以及双向绑定
    const paperValue = ref('')
    const paperRules:RuleProp[] = [
      { type: 'required', message: '文章详情不能为空' }
    ]

    // 提交表单的验证转跳
    const onFormSubmit = (result:boolean) => {
      // 表单验证通过
      if (result) {
        const { column } = store.state.user
        // type gaurd
        if (column) {
          const newPosts:IPostData = {
            _id: new Date().getTime().toString(),
            title: titleValue.value,
            content: paperValue.value,
            column,
            createAt: new Date().toLocaleString()
          }
          // 将新创建的数据传入仓库中，并转跳至column页
          store.commit('createPost', newPosts)
          router.push({
            name: 'columns',
            params: {
              id: column
            }
          }
          )
        }
      }
    }

    return { titleValue, titleRules, paperValue, paperRules, onFormSubmit }
  }
})
</script>

<style scoped>

</style>
