<template>
  <tap-button class="button is-medium actions-list-button">
    <span class="icon" v-if="icon">
      <span :class="`icon-${icon}`"></span>
    </span>
    <span class="button-text">
      <slot>
        Cancel
      </slot>
    </span>
    <span class="button-hint">
      <small>
        <slot name="hint" />
      </small>
    </span>
    <span v-if="$slots.extra" class="button-extra">
      <slot name="extra" />
    </span>
  </tap-button>
</template>

<script>
export default {
  name: 'ActionsListButton',

  props: {
    icon: {
      type: [ String, undefined ],
      default: undefined
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.actions-list-button
  width: 100%
  display: flex
  position: relative
  justify-content: flex-start
  border-bottom: solid 1px $gabbi-grey-2
  .icon
    margin-left: 0 !important
  &:hover,
  &:focus,
  &:active
    color: $gabbi-pink
    box-shadow: none !important
    border-color: transparent
    border-bottom: solid 1px $gabbi-grey-2
  > span
    display: inline-block
    transform: translate3d(0, 0%, 0)
    transition: transform $tx-duration-sm $tx-ease
  &:active
    transform: translate3d(0, 0%, 0)
    > span
      transform: translate3d(0, 4%, 0)
  &:not(:first-child):not(:last-child):not(:only-child)
    border-radius: 0
  &:first-child:not(:only-child):not(.is-cancel)
    border-bottom-left-radius: 0
    border-bottom-right-radius: 0
  &:last-child:not(:only-child):not(.is-cancel)
    border-top-left-radius: 0
    border-top-right-radius: 0
  &:last-child
    border-bottom: none !important

.button-text
  // color: $gabbi-navy

.button-hint
  margin-left: auto
  color: $gabbi-grey-0

.button-extra
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 1
  position: absolute
</style>
