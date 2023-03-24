<template>
  <div class="userProfile-container">
    <div class="img-container">
      <img :src="author?  (author.avatar as ImageData).url:'../assets/R-C.jpg'" :alt="author && author.nickName">
    </div>
    <div class="user-info">
      <p>{{ author && author.nickName }}</p>
      <span>{{ author && author.description }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
// 引入数据格式
import { UserProps, ImageData } from '@/store'

export default defineComponent({
  name: 'UserProfile',
  props: {
    author: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup () {
    return {}
  }
})
</script>

<style scoped lang="less">
.userProfile-container{
  display: flex;
  justify-content: space-between;
  .img-container{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid gray;
    overflow: hidden;
    img{
      width: 100%;
    }
  }
  .user-info{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    p{
      font-weight: 600;
      margin-bottom: 5px;
    }
    span{
      color: gray;
    }
  }
}
</style>
