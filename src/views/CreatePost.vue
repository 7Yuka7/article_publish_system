<template>
  <div class="createPost-container">
    <h4>{{ isEidt ? '修改文章' : '发表文章' }}</h4>
    <!-- 上传图片 -->
    <div class="uploader-container">
      <UploaderView :action="'/upload'"
        class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
        :before-upload="CheckFunction" :updatePosts="updateData" @file-uploaded="fileUploaded"
        @file-uploaded-error="fileUploadedError">
        <!-- 默认 -->
        <h2>点击上传头图</h2>
        <!-- 上传中 -->
        <template #loading>
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <h2>&nbsp;&nbsp;&nbsp;&nbsp;加载中</h2>
        </template>
        <!-- 上传成功 -->
        <template #loaded="imgData">
          <img :src="imgData.fileData.data.url" style="width: 100%; height:100%; object-fit:cover ;">
        </template>
        <!-- 上传失败 -->
        <template #fillLoad>
          <h2>上传失败</h2>
        </template>
      </UploaderView>
    </div>

    <!-- 表单验证 -->
    <ValidateForm @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题</label>
        <ValidateInput :rules="titleRules" v-model="titleValue" placeholder="请输入文章标题" type="text"></ValidateInput>
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情</label>
        <!-- markdown输入框 -->
        <MarkDownEditor v-model="paperValue" :options="options" ref="editoreRef" @blur="checkEditor"
          :class="{ 'is-invalid': !editorStatus.isValid }"></MarkDownEditor>
        <!-- 错误信息显示 -->
        <span v-if="!editorStatus.isValid" class="invalid-feedback mt-1">{{ editorStatus.message }}</span>
        <!-- <ValidateInput :rules="paperRules" v-model="paperValue" placeholder="请输入文章详情" type="text" tag='textarea'
          rows="10"></ValidateInput> -->
      </div>
      <template #submit>
        <button type="submit" class="btn btn-primary w-100" :style="{ 'marginRight': '5px' }">{{ isEidt ? '修改文章' : '发表文章'
        }}</button>
      </template>
      <template #clearInput>
        <button type="submit" class="btn btn-danger w-100">清空内容</button>
      </template>
    </ValidateForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive } from 'vue'
// 组件复用
// 上传头图组件
import UploaderView from '@/components/UploaderView.vue'
// 表单组件
import ValidateForm from '@/components/ValidateForm.vue'
import ValidateInput, { RuleProp } from '@/components/ValidateInput.vue'
// message组件
import createMessage from '@/components/createMessage'
// markdown组件
import EasyMDE, { Options } from 'easymde'
import MarkDownEditor from '@/components/MarkDownEditor.vue'

// 引入路由和仓库
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

// 引入数据格式
import { GlobalDataProps, IPostData, ImageData, ResponseType } from '@/store/index'

// 引入验证函数
import useCheckFile from '@/hooks/useCheckFile'

// markdown类型
interface EditorInstance {
  clear: () => void,
  getMDEInstance: () => EasyMDE | null
}

export default defineComponent({
  name: 'CreatePost',
  components: {
    ValidateForm,
    ValidateInput,
    UploaderView,
    MarkDownEditor
  },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const store = useStore<GlobalDataProps>()

    // 获取实例对象
    const editoreRef = ref<EditorInstance>()
    // 获取当前状态
    const editorStatus = reactive({
      isValid: true,
      message: ''
    })
    // 检查状态的方法
    const checkEditor = () => {
      // 如果文章内容为空
      if (paperValue.value.trim() === '') {
        editorStatus.isValid = false
        editorStatus.message = '文章详情不能为空'
      } else {
        editorStatus.isValid = true
        editorStatus.message = ''
      }
    }
    // 配置要传入markdown输入框的option
    const options: Options = {
      spellChecker: false
    }

    // 验证是否是修改模式
    const isEidt = !!route.query.id
    const updateData = ref() // 用来存储需要修改的数据

    // 挂载的时候根据是否是修改模式发请求
    onMounted(async () => {
      if (isEidt) {
        try {
          await store.dispatch('fetchPaper', route.query.id) // 派发请求，更新数据
          const currentPost = store.state.postDetail // 拿到数据
          if (currentPost.image) {
            updateData.value = { data: currentPost.image }
          }
          // 将其他数据依次赋值
          titleValue.value = currentPost.title as string
          paperValue.value = currentPost.content || ''
        } catch (error) {
          console.log(error)
          createMessage('更新数据失败，请刷新', 'error', 1500)
        }
      }
    })

    // title数据验证以及双向绑定
    let imageId = ''
    const titleValue = ref('')
    const titleRules: RuleProp[] = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    // paper数据验证以及双向绑定
    const paperValue = ref('')
    // const paperRules: RuleProp[] = [
    //   { type: 'required', message: '文章详情不能为空' }
    // ]

    // 提交表单的验证转跳
    const onFormSubmit = async (result: boolean) => {
      checkEditor()
      // 表单验证通过
      if (result && editorStatus.isValid) {
        // 拿到发送表单请求需要的数据 -- column为个人的标识
        const { column, _id } = store.state.user
        // type gaurd
        if (column) {
          const newPosts: IPostData = {
            title: titleValue.value,
            content: paperValue.value,
            column,
            author: _id
          }
          if (imageId) {
            newPosts.image = imageId
          }
          // 将新创建的数据传入仓库中，并转跳至column页 -- 根据需求的不同，派发不同的actions以及data
          const dispatchAction = isEidt ? 'patchPaper' : 'postPaper'
          const data = isEidt ? { id: route.query.id, data: { title: titleValue.value, content: paperValue.value, image: imageId } } : newPosts
          try {
            await store.dispatch(dispatchAction, data)
            createMessage(isEidt ? '更新文章成功，两秒后进行转跳' : '创建文章成功，两秒后进行转跳', 'success', 1500)
            setTimeout(() => {
              router.push({
                name: 'columns',
                params: {
                  id: column
                }
              }
              )
            }, 2000)
          } catch (error) {
            createMessage('操作失败', 'error', 1500)
          }
        }
      }
    }

    // 提交前先对文件进行验证
    const CheckFunction = (file: File): boolean => {
      const result = useCheckFile(file, { format: ['image/jpeg', 'image/png'], size: 1 })
      // 解构
      const { passed, error } = result
      if (error === 'format') {
        createMessage('上传图片的格式为jpg/png', 'error', 1500)
      }
      if (error === 'size') {
        createMessage('文件大小不可超过1mb', 'error', 1500)
      }
      return passed
    }

    // 上传文件的成功与否 -- 成功创建成功的信息，失败创建失败的信息
    const fileUploaded = (rawData: ResponseType<ImageData>) => {
      // 成功记录上传的图片ID
      if (rawData.data._id) {
        imageId = rawData.data._id
      }
      createMessage(`上传图片成功 ID：${rawData.data._id}`, 'success', 1500)
    }

    const fileUploadedError = (error: object) => { // 不知道怎么人为设置失败的一个case，因此不知道失败的error的数据格式
      createMessage(`上传失败${error}`, 'error', 1500)
    }

    // 返回数据
    return { titleValue, titleRules, paperValue, onFormSubmit, CheckFunction, fileUploaded, fileUploadedError, updateData, isEidt, options, editoreRef, checkEditor, editorStatus }
  }
})
</script>

<style lang="less">
.createPost-container {
  width: 90%;
  margin: auto;
  border: 3px solid rgba(0, 0, 0, 0.2);
  border-radius: 3%;
  margin-bottom: 15px;
  padding: 20px;

  .file-upload-container {
    height: 250px;
    cursor: pointer;
    margin-bottom: 15px;
  }
}
</style>
