<template>
  <div :class="{ 'message-actions': true, 'buttons': true, 'has-addons': true, 'is-lonely': isLonely }">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'MessageActions',

  props: {
    isLonely: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="sass" scoped>
.buttons
  margin-bottom: 0 !important
  .button
    margin-right: 2px !important
    margin-bottom: 0
    &:last-child
      margin-right: 0 !important
    &:not(.is-icon)
      flex: 1
    &.is-icon
      width: 4rem
      min-width: 4rem

.message-actions
  z-index: 1
  position: relative
  .button
    &:first-child
      border-top-left-radius: 0
  &.is-lonely
    .button
      &:last-child
        border-top-right-radius: 0

</style>
