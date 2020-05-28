<template>
  <tap :class="[ 'app-filter-tab', (active && 'is-active') ]">
    <slot />
  </tap>
</template>

<script>
export default {
  name: 'AppFilterTab',

  props: {
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.app-filter-tab
  height: $FILTER_BAR_HEIGHT
  line-height: $FILTER_BAR_HEIGHT
  margin-right: $margin
  font-size: $font-size-sm
  &:last-child
    margin-right: 0
  &.is-active
    box-shadow: 0 -3px 0 $gabbi-pink inset
</style>
