<template>
  <tap :class="[ 'action-button', 'button', 'is-primary', 'flex', 'is-centered', disabled && 'is-disabled' ]" @click.native="tap">
    <span class="icon"><slot /></span>
  </tap>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    tap () {
      if (this.disabled) {
        this.$emit('disabled')
      } else {
        this.$emit('tapped')
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.button.is-primary.action-button
  width: $TAB_HEIGHT
  height: $TAB_HEIGHT
  box-shadow: 0 $shadow-offset-lg $shadow-blur-lg $shadow-pink, 0 $shadow-offset-lg $shadow-blur-lg 7px $gabbi-grey-3 !important
  border-radius: $border-radius-lg
  &.is-disabled
    opacity: 0.5

.icon
  font-size: $icon-size
</style>
