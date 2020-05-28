<template>
  <div class="accordion">
    <tap tag="header" class="accordion-header" @click.native="showContent = !showContent">
      <slot name="header" />
      <div class="icon-outer flex is-column is-centered">
        <span :class="[ 'icon', showContent && 'is-open' ]">
          <span class="is-1"></span>
          <span class="is-2"></span>
        </span>
      </div>
    </tap>
    <div :class="{ 'accordion-content': true, 'is-overflow-hidden': overflowHidden }" :style="contentStyle">
      <div class="accordion-content-inner" ref="contentInner">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Accordion',

  props: {
    padding: {
      type: Number,
      default: 0
    },

    showInitial: {
      type: [ Boolean, undefined ],
      default: false
    }
  },

  data () {
    return {
      active: false,
      running: false,
      showContent: this.showInitial,
      contentHeight: 0,
      currentHeight: 0
    }
  },

  computed: {
    overflowHidden () {
      return this.active || this.currentHeight === 0
    },

    maxHeight () {
      return Math.round(this.contentHeight + (this.padding * 2))
    },

    contentStyle () {
      const height = Math.round(this.currentHeight) + 'px'
      const margin = (-this.padding) + 'px'
      const padding = this.padding + 'px'
      const opacity = this.showContent ? 1 : 0

      return {
        height,
        margin,
        padding,
        opacity
      }
    }
  },

  methods: {
    run () {
      if (this.running) return

      this.running = true
      this.loop()
    },

    loop () {
      if (!this.running) return

      let nextHeight = this.showContent ? this.maxHeight : 0

      const dist = nextHeight - this.currentHeight

      this.currentHeight += dist * 0.1

      if (this.active) {
        if (Math.round(this.currentHeight) >= nextHeight) {
          this.active = false
        }
      }

      requestAnimationFrame(this.loop.bind(this))
    },

    getContentHeight () {
      const brect = this.$refs.contentInner.getBoundingClientRect()
      return brect.height
    }
  },

  mounted () {
    this.contentHeight = this.getContentHeight()
    this.run()
  },

  updated () {
    this.contentHeight = this.getContentHeight()
  },

  destroyed () {
    this.running = false
  },

  watch: {
    showContent () {
      this.active = true
    },

    $slots: {
      deep: true,
      handler () {
        if (!this.showContent) return
        
        this.active = true
        this.contentHeight = this.getContentHeight()
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.accordion-header
  cursor: pointer
  position: relative
  .icon-outer
    position: absolute
    top: 0
    right: 0
    bottom: 0

.icon
  > span
    top: 0
    left: 0
    width: 100%
    height: 100%
    display: flex
    opacity: 1
    position: absolute
    transform: rotate(0deg)
    transition: all $tx-duration-sm $tx-ease
    align-items: center
    justify-content: center
    &::after
      content: ''
      display: block
      width: 2px
      height: 80%
      background: $gabbi-grey-0
      border-radius: 2px
    &.is-2
      transform: rotate(90deg)
  &.is-open
    > span.is-1
      transform: rotate(90deg)
    > span.is-2
      opacity: 0
      transform: rotate(180deg)

.accordion-content
  transition: opacity $tx-duration $tx-ease
  &.is-overflow-hidden
    overflow: hidden

</style>
