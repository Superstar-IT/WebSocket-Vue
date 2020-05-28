<template>
  <tap class="close-outer">
    <button type="button" :class="{
      'close-button': true,
      'is-icon': true,
      'button': true,
      'is-primary': !inverted,
      'is-primary-inverted': inverted,
      'is-small': true
    }">
      <span class="icon">
        <span :class="`icon-chevron-${direction}`"></span>
      </span>
    </button>
  </tap>
</template>

<script>
export default {
  name: 'CloseButton',

  props: {
    inverted: {
      type: Boolean,
      default: false,
    },

    direction: {
      type: String,
      default: 'down' // down, left
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.close-outer
  padding: 10px

.close-button.button.is-primary
  width: 30px
  padding: 0
  display: flex
  align-items: center
  justify-content: center
  box-shadow: 0 $shadow-offset-sm $shadow-blur-sm $shadow-pink, 0 $shadow-offset-sm $shadow-blur-sm 7px $gabbi-grey-3 !important
  .icon
    font-size: 14px
</style>
