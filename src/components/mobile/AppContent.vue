<template>
  <div class="app-content" :style="style">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'AppContent',

  props: {
    shrink: {
      type: Number,
      default: 0
    },

    scroll: {
      type: [ Boolean, undefined ],
      default: undefined
    }
  },

  computed: {
    style () {
      const height = `calc(100% - ${this.shrink}px)`
      const overflowY = this.scroll ? 'auto' : 'hidden'
      return {
        height,
        overflowY,
        maxHeight: height
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.app-content
  flex: 1
  width: 100%
  position: relative
</style>
