<template>
  <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50" />
          <h2 class="font-weight-light">山风专栏，分享您的故事</h2>
          <p>
            <a href="#" class="btn btn-primary my-2">开始写文章</a>
          </p>
        </div>
      </div>
    </section>
    <!-- test -->
    <UploaderView :action="'/upload'" :beforeUpload="CheckFunction" @file-uploaded="fileUploaded"
      @file-uploaded-error="fileUploadedError">
      <h2>点击上传</h2>
      <!-- 上传中改为spinner -->
      <template #loading>
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </template>
      <!-- 上传成功--显示可以复原的x号 -->
      <template #loaded="imgData">
        <div class="img-container" >
          <img :src="imgData.fileData.data.url" alt="">
        </div>
      </template>
    </UploaderView>

    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <ColumnList :list="list"></ColumnList>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
// 引入组件
import ColumnList from '@/components/ColumnList.vue' // 卡片组件
import UploaderView from '../components/UploaderView.vue' // 上传组件
import createMessage from '@/components/createMessage' // message组件
// 引入store以及需要用到的数据结构
import { useStore } from 'vuex'
import { GlobalDataProps, ImageData, ResponseType } from '@/store'

export default defineComponent({
  name: 'HomeView',
  components: { ColumnList, UploaderView },
  setup () {
    const store = useStore<GlobalDataProps>()
    // 从store中获取专栏数据
    const list = computed(() => {
      return store.state.colums
    })
    // 挂载函数
    onMounted(() => {
      // 派发请求
      getData()
    })
    // 请求数据函数
    const getData = () => {
      store.dispatch('fetchColumnData')
    }

    // 上传文件的检查
    const CheckFunction = (file: File) => {
      let result = true
      // 判断是否是jpg形式的图片文件，不是就报错
      if (file.type !== 'image/jpeg') {
        console.log(file.type)
        result = false
        createMessage('上传的图片只能是JPG格式', 'error', 2000)
      }
      return result
    }

    // 上传文件的成功与否 -- 成功创建成功的信息，失败创建失败的信息
    const fileUploaded = (rawData: ResponseType<ImageData>) => {
      createMessage(`上传图片成功 ID：${rawData.data._id}`, 'success', 1500)
    }
    const fileUploadedError = () => { // 不知道怎么人为设置失败的一个case，因此不知道失败的error的数据格式
      createMessage('上传图片失败', 'error', 1500)
    }

    // 返回数据
    return {
      list,
      CheckFunction,
      fileUploaded,
      fileUploadedError
    }
  }
})
</script>

<style scoped></style>
