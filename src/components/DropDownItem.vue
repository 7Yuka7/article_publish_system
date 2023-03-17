<template>
  <li class="dropdown-option" :class="{'is-disabled': disabled}">
    <slot></slot>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DropDownItem',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup () {
    return {}
  }
})
</script>

<!-- 这里不可以使用 scoped 因为这个是slot传入的一个html，因此不能将样式只限于本组件 -->
<style>
.dropdown-option.is-disabled * {
  color: #6c757d;
  pointer-events: none;
  background-color: transparent;
}
</style>
