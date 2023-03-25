import { useStore } from 'vuex'
import { ref, computed, ComputedRef } from 'vue'

export interface LoadParams {
  currentPage: number;
  pagaSize: number
}

const useLoadMore = (actionName: string, total:ComputedRef<number>, params:LoadParams = { currentPage: 2, pagaSize: 5 }, id?:string) => {
  const store = useStore()
  const currentPage = ref(params.currentPage)
  const requestParams = computed(() => ({
    id: id,
    currentPage: currentPage.value,
    pageSize: params.pagaSize
  }))

  const loadMorePage = async () => {
    try {
      await store.dispatch(actionName, requestParams.value)
      currentPage.value++
      // console.log('总页数', total.value, '一页显示', params.pagaSize, '当前页数', currentPage.value)
    } catch (error) {
      console.error('加载更多错误', error)
    }
  }

  const isLastPage = computed(() => {
    return Math.ceil(total.value / params.pagaSize) < currentPage.value
  })
  return {
    loadMorePage,
    isLastPage
  }
}

export default useLoadMore
