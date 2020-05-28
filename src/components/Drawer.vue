<template>
  <div :class="`drawer is-from-${slideFrom}`">
    <transition name="drawer-fade">
      <tap v-if="visible" class="drawer-background" @click.native="$emit('background')"></tap>
    </transition>
    <transition name="drawer-slide">
      <div v-if="visible" class="drawer-inner" :style="{ width }">
        <slot :visible="visible" />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '100%'
    },

    visible: {
      type: Boolean,
      default: true
    },

    slideFrom: {
      type: String,
      default: 'right' // right, left
    }
  },

  watch: {
    visible (visible) {
      if (visible) this.$emit('hide')
      else this.$emit('show')
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.drawer
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 1
  position: absolute
  pointer-events: none

.drawer-background
  top: 0
  left: 0
  width: 100%
  height: 100%
  opacity: 0.2
  position: absolute
  background: desaturate($gabbi-navy, 15)
  pointer-events: auto

.drawer-fade-enter-active,
.drawer-fade-leave-active
  transition: opacity $tx-duration

.drawer-fade-enter,
.drawer-fade-leave-to
  opacity: 0

.drawer-inner
  top: 0
  left: 0
  height: 100%
  z-index: 1
  position: absolute
  transform: translate3d(0%, 0, 0)
  background: $gabbi-grey-3
  box-shadow: 0 0 ($shadow-blur-lg * 2) rgba(desaturate($gabbi-navy, 15), 0.2)
  pointer-events: auto

.drawer-slide-enter-active,
.drawer-slide-leave-active
  transition: transform $tx-duration

.is-from-left
  .drawer-slide-enter,
  .drawer-slide-leave-to
    transform: translate3d(-100%, 0, 0)

.is-from-right
  .drawer-slide-enter,
  .drawer-slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
