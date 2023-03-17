import { Ref, onMounted, onUnmounted } from 'vue'
// 传入的是下拉菜单框的整个HTML结构，需要用其来判断当前点击事件是否被包含 将当前下拉框的状态也一并传入
const useClickOutside = (elementRef:Ref<null | HTMLElement>, isOpen:Ref<boolean>) => {
  const handler = (e:MouseEvent) => {
    // 类型守卫
    if (elementRef.value) {
      // 如果点击的区域不在这个下拉框内,而且此时的下拉框是下拉状态
      if (!elementRef.value.contains(e.target as HTMLElement) && isOpen.value) {
        isOpen.value = !isOpen.value
      }
    }
  }
  // 挂载与卸载
  onMounted(() => {
    document.addEventListener('click', handler)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
  return isOpen
}

export default useClickOutside
