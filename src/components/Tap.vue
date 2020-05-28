<template>
  <component :is="tag">
    <slot></slot>
  </component>
</template>

<script>
export default {
  name: 'Tap',

  props: {
    tag: {
      type: String,
      default: 'div'
    }
  }
}
</script>
