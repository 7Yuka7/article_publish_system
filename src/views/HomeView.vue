<template>
  <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50" />
          <h2 class="font-weight-light">山风专栏，分享您刚编的故事</h2>
          <p>
            <a href="#" class="btn btn-primary my-2">开始写文章</a>
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <ColumnList :list="list"></ColumnList>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
// 引入卡片组件
import ColumnList from '../components/ColumnList.vue'
// 引入store以及需要用到的数据结构
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'

export default defineComponent({
  name: 'HomeView',
  components: { ColumnList },
  setup () {
    const store = useStore<GlobalDataProps>()
    const list = computed(() => {
      return store.state.colums
    })
    return {
      list
    }
  }
})
</script>

<style scoped></style>
