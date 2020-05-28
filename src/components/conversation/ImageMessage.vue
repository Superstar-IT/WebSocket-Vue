<template>
  <div :class="{ 'image-message': true, 'is-right': right, 'show-body': showBody }">
    <animeta-transition
      :to="{ opacity: 1 }"
      :from="{ opacity: 0 }"
      :options="{ easing: 'linear', duration: 150 }"
    >
      <div v-show="isInViewport" class="image" :style="{ backgroundImage: `url('${media.url}')`}"></div>
    </animeta-transition>
    <div v-if="showBody" class="image-info flex is-row">
      <div class="flex-item">
        <small>{{ sender }}</small>
      </div>
      <div class="flex-item is-aligned-right">
        <small>{{ timestamp }}</small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageMessage',

  props: {
    right: {
      type: Boolean,
      default: false
    },

    media: {
      type: Object,
      required: true
    },

    showBody: {
      type: Boolean,
      default: false
    },

    sender: {
      type: [ String, undefined ],
      default: undefined
    },

    timestamp: {
      type: [ String, undefined ],
      default: undefined
    }
  },

  data () {
    return {
      isInViewport: false
    }
  },

  methods: {
    checkIfInViewport () {
      if (!this.$el) return false

      const rect = this.$el.getBoundingClientRect()

      this.isInViewport = (rect.top <= window.innerHeight && rect.bottom >= 0)
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.image-message
  width: 100%
  position: relative
  padding-top: 75%
  background-color: $gabbi-grey-2
  &:not(.is-right)
    &:first-child
      border-top-right-radius: $border-radius
      .image,
      .image-info
        border-top-right-radius: $border-radius
    &:last-child:not(.show-body)
      border-bottom-right-radius: 0
      .image,
      .image-info
        border-bottom-right-radius: 0
    &:last-child.show-body
      border-bottom-right-radius: $border-radius
      .image,
      .image-info
        border-bottom-right-radius: $border-radius
  &.is-right
    &:first-child
      border-top-left-radius: $border-radius
      .image,
      .image-info
        border-top-left-radius: $border-radius
    &:last-child:not(.show-body)
      border-bottom-left-radius: 0
      .image,
      .image-info
        border-bottom-left-radius: 0
    &:last-child.show-body
      border-bottom-left-radius: $border-radius
      .image,
      .image-info
        border-bottom-left-radius: $border-radius

.image
  top: 0
  left: 0
  width: 100%
  height: 100%
  position: absolute
  background-size: cover
  background-repeat: no-repeat
  background-position: 50% 50%

.image-info
  left: 0
  width: 100%
  color: $gabbi-white
  bottom: 0
  padding: ($margin * 4) $margin $margin $margin
  z-index: 1
  position: absolute
  text-shadow: 0 0 1px rgba(#212126, 0.6)
  background-image: linear-gradient(to bottom, rgba(#212126, 0), rgba(#212126, 0.6))
</style>
