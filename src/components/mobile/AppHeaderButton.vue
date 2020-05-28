<template>
  <tap class="app-header-button flex is-centered">
    <span class="icon">
      <span :class="`icon-${icon}`"></span>
    </span>
  </tap>
</template>

<script>
export default {
  name: 'AppHeaderButton',

  props: {
    icon: {
      type: String,
      default: 'hotdog'
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.app-header-button
  width: 40px
  height: 40px
  cursor: pointer
  min-width: 40px
  min-height: 40px
  transition: all $tx-duration-sm $tx-ease
  transform: translate3d(0, 0%, 0)
  &:active
    transform: translate3d(0, 3%, 0)

.icon
  color: $gabbi-white
  font-size: $icon-size
</style>
