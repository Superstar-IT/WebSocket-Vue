<template>
  <div class="modal-outer">
    <div class="modal is-active">

      <animeta-transition :to="{ opacity: 0.85 }" :from="{ opacity: 0 }" :options="{ duration: 150, easing: 'linear' }">
        <div v-if="visible" class="modal-background"></div>
      </animeta-transition>

      <animeta-transition :to="{ translateY: '0%' }" :from="{ translateY: '100%' }" :options="{ duration: 600, elasticity: 0 }">
        <div v-if="visible" :class="[ 'modal-content', (tall && 'is-tall'), (!hasControls && 'has-no-controls'), (hasNotch && 'has-notch') ]">
          <div class="modal-content-inner flex is-column">

            <close-button v-if="closeButton" class="modal-close-button" @click.native="$emit('close')" />

            <div :class="{ 'modal-slot': true, 'is-scrolling': scroll }">
              <div class="modal-slot-inner">
                <slot />
              </div>
            </div>

            <div v-if="hasControls" class="modal-controls flex">
              <div class="flex-item flex">
                <slot name="controls-left" />
              </div>
              <div class="flex-item is-right flex">
                <slot name="controls-right" />
              </div>
            </div>

          </div>
        </div>
      </animeta-transition>

    </div>
  </div>
</template>

<script>
import CloseButton from '@/components/CloseButton.vue'

export default {
  name: 'Modal',

  components: {
    CloseButton
  },

  props: {
    tall: {
      type: [ Boolean, undefined ],
      default: undefined
    },

    scroll: {
      type: Boolean,
      default: true
    },

    visible: {
      type: Boolean,
      default: true
    },

    closeButton: {
      type: [ Boolean, undefined ],
      default: true
    }
  },

  computed: {
    hasNotch () {
      return this.$store.getters.hasNotch
    },

    hasControls () {
      return this.$slots['controls-left'] !== undefined || this.$slots['controls-right'] !== undefined
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.modal-outer
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 10
  position: absolute
  pointer-events: none

.modal
  align-items: flex-end

.modal-background
  opacity: 0.85
  background: $gabbi-grey-2
  pointer-events: all

.modal-content
  margin: 0
  padding: 0 $margin-lg $margin-lg $margin-lg
  overflow: visible !important
  position: relative
  transform: translate3d(0, 0%, 0)
  max-height: calc(100vh - 20px)
  pointer-events: auto
  &.has-notch
    max-height: calc(100vh - 55px)
  &.is-tall
    height: 100%
    .modal-controls
      &::before
        top: 0
        left: 0
        right: 0
        height: $margin-lg + $margin-sm
        z-index: 1
        content: ''
        position: absolute
        transform: translateY(-100%)
        background: linear-gradient(rgba($gabbi-white, 0), $gabbi-white)
        pointer-events: none
  &.has-no-controls
    padding-bottom: 0 !important
    .modal-slot-inner
      padding-bottom: 0 !important
  &:before
    content: ''
    top: 0
    left: 0
    right: 0
    bottom: -200px
    position: absolute
    background: $gabbi-white
    box-shadow: 0 $shadow-offset-lg $shadow-blur-lg $shadow-grey
    border-radius: $border-radius-lg $border-radius-lg 0 0

.modal-content-inner
  width: 100%
  height: 100%
  position: relative

.modal-close-button
  top: calc(#{$margin-lg} - 10px)
  right: -10px
  z-index: 2
  position: absolute

.modal-slot
  flex: 1
  height: 100%
  margin: 0 (-$margin-lg)
  padding: 0 $margin-lg
  &.is-scrolling
    overflow-y: auto

.modal-slot-inner
  width: 100%
  height: 100%
  padding: $margin-lg 0
  box-sizing: border-box

.modal-controls
  height: $control-height-lg
  z-index: 1
  position: relative
  min-height: $control-height-lg
  background: $gabbi-white
  &:empty
    display: none
  &:not(:empty)
    + .modal-slot
      height: calc(100% - #{$control-height-lg} - #{$margin-lg + $margin-sm})

/deep/
  .modal-controls
    .flex-item
      &.is-right
        margin-left: auto
        .field
          margin-left: $margin-sm
          margin-bottom: 0
      &:not(.is-right)
        .field
          margin-right: $margin-sm
          margin-bottom: 0
</style>
