<template>
  <div :class="{ 'app-header': true, 'has-notch': hasNotch }">
    <div class="app-header-inner">
      <div class="app-header-buttons is-left flex">
        <slot name="buttons-left" />
      </div>
      <div class="app-header-buttons is-right flex">
        <slot name="buttons-right" />
      </div>
      <tap class="app-header-title flex is-column" @click.native="clickTitle">
        <div class="flex-item title">
          <slot name="title" />
        </div>
        <div class="flex-item subtitle">
          <slot name="subtitle" />
        </div>
      </tap>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppHeader',

  props: {},

  computed: {
    hasNotch () {
      return this.$store.getters.hasNotch
    }
  },

  methods: {
    clickTitle () {
      this.$emit('title')
    }
  },

  HEADER_HEIGHT: 70,
  HEADER_HEIGHT_NOTCH: 85
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.app-header
  width: 100%
  color: $gabbi-white
  height: $HEADER_HEIGHT
  padding: 20px $margin-fixed $margin-fixed $margin-fixed
  position: relative
  min-height: $HEADER_HEIGHT
  background: $gabbi-pink
  &.has-notch
    height: $HEADER_HEIGHT_NOTCH
    padding-top: 35px !important
  &::after
    bottom: 0
    left: 0
    right: 0
    height: $shadow-blur
    z-index: 1
    content: ''
    opacity: 0.2
    position: absolute
    transform: translateY(100%)
    background: linear-gradient($gabbi-navy, rgba($gabbi-navy, 0))
    pointer-events: none

.app-header-inner
  height: 100%
  width: 100%
  position: relative

.app-header-title
  top: 0
  left: 0
  right: 0
  height: 40px
  z-index: 0
  position: absolute
  .title,
  .subtitle
    color: $gabbi-white
    width: 100%
    margin: 0 !important
    text-align: center
    font-weight: normal
    &:empty
      display: none
  .title
    font-size: 18px
    line-height: 24px
  .subtitle
    font-size: 14px
    line-height: 16px

.app-header-buttons
  top: 0
  height: 40px
  z-index: 1
  position: absolute
  min-width: 40px
  &.is-left
    left: 0
    padding-right: 20px
  &.is-right
    right: 0
    padding-left: 20px
</style>
