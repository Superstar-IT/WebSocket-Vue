<template>
  <router-link :to="to" :class="[ 'app-tab-button', 'flex', 'is-centered', (selected && 'is-selected') ]">
    <span class="icon">
      <span :class="`icon-${icon}`"></span>
    </span>
  </router-link>
</template>

<script>
export default {
  name: 'AppTabButton',

  props: {
    to: {
      type: String,
      default: '/'
    },
    icon: {
      type: String,
      default: 'hotdog'
    },
    selected: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.app-tab-button
  width: 50px
  height: 40px
  cursor: pointer
  min-width: 50px
  min-height: 40px
  border-radius: $border-radius
  transition: all $tx-duration-sm $tx-ease
  transform: translate3d(0, 0%, 0)
  &:active
    transform: translate3d(0, 3%, 0)
  &.is-selected
    background: $gabbi-pink
    box-shadow: 0 $shadow-offset $shadow-blur $shadow-pink
    .icon
      color: $gabbi-white !important

.icon
  color: $gabbi-grey-0
  font-size: $icon-size

</style>
