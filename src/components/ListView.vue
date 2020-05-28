<template>
  <div class="list-view" @touchstart="dragStart" @touchend="dragEnd" @touchcancel="dragEnd" @touchmove="drag" @wheel="wheel">
    <div class="list-pull flex is-column is-centered pad" :style="{ height: margin + 'px' }">
      <slot name="pull">
      </slot>
    </div>
    <div v-if="hasMounted" class="list-view-inner" :style="style">
      <slot />
    </div>
  </div>
</template>

<script>
import { clamp } from '@/helpers/math.js'

export default {
  name: 'ListView',

  provide () {
    return {
      listView: this.provider
    }
  },

  props: {
    margin: {
      type: Number,
      default: 100
    },

    itemHeight: {
      type: [ Number, undefined ],
      default: undefined
    },

    scrollOffset: {
      type: Number,
      default: 0
    },
  },

  data () {
    return {
      height: 0,
      dragging: false,
      scrollTo: undefined,
      velocity: 0,
      scrollPos: 0,
      hasMounted: false,
      scrollHeight: 0,
      dragStartPos: 0,
      nextVelocity: 0,
      scrolledToTop: false,
      scrollStartPos: 0,
      scrolledToBottom: false,
      resizeDebounceTimeout: null,
      provider: {
        virtual: false,
        scrollTop: 0,
        viewportHeight: 0
      }
    }
  },

  computed: {
    top () {
      return this.margin - this.scrollOffset
    },

    bottom () {
      return this.scrollHeight - this.margin
    },

    style () {
      const { height, margin } = this

      const style = { margin: `${margin}px 0` }
      if (height) style.height = height + 'px'

      return style
    }
  },

  created () {
    window.addEventListener('resize', this.windowResize)
  },

  mounted () {
    this.hasMounted = true

    this.$nextTick(() => {
      this.getViewportHeight()
      this.setHeight()

      this.scrollPos = this.margin
      this.ready = true

      this.running = true
      this.update()

      this.$emit('mounted')
    })
  },

  updated () {
    this.getViewportHeight()
    this.setHeight()

    this.$nextTick(() => {
      this.$emit('updated')
    })
  },

  beforeDestroy () {
    this.running = false
    window.removeEventListener('resize', this.windowResize)
  },

  methods: {
    windowResize () {
      clearTimeout(this.resizeDebounceTimeout)
      this.resizeDebounceTimeout = setTimeout(() => {

        this.$forceUpdate()

        this.$nextTick(() => {
          this.getViewportHeight()
          this.setHeight()

          this.$nextTick(() => {
            this.$emit('resize')
          })
        })
      }, 200)
    },

    // Scroll handling

    drag (evt) {
      evt.preventDefault()

      const { margin, scrollPos, scrollHeight, scrollStartPos } = this

      this.dragging = true

      const diff = evt.touches[0].clientY - this.dragStartPos
      let nextPos = scrollStartPos - diff

      // Top
      if (scrollPos < margin) {
        const factor = scrollPos / margin
        nextPos = scrollStartPos - (diff * factor)
      }

      // Bottom
      else if (scrollPos > scrollHeight - margin) {
        const offset = scrollHeight - margin
        const factor = 1 - ((scrollPos - offset) / margin)
        nextPos = scrollStartPos - (diff * factor)
      }

      this.scrollPos = clamp(nextPos, 0, scrollHeight)
      this.nextVelocity = -diff

      this.dragStartPos = evt.touches[0].clientY
      this.scrollStartPos = this.scrollPos
    },

    dragEnd () {
      this.dragging = false
      this.velocity = this.nextVelocity
    },

    dragStart (evt) {
      this.scrollTo = undefined
      this.velocity = 0
      this.nextVelocity = 0

      this.dragStartPos = evt.touches[0].clientY
      this.scrollStartPos = this.scrollPos
    },

    wheel (evt) {
      this.scrollTo = undefined
      this.velocity = 0
      this.nextVelocity = 0

      this.scrollPos = clamp(
        this.scrollPos + evt.deltaY,
        this.margin - this.scrollOffset,
        this.scrollHeight - this.margin
      )

      this.$emit('scroll', this.scrollPos)
    },

    update () {
      if (!this.running) return

      if (!this.dragging) {

        // Velocity / physics

        const lastPos = Math.floor(this.scrollPos)

        this.scrollPos = clamp(this.scrollPos + this.velocity, 0, this.scrollHeight)
        this.velocity *= 0.975

        if (Math.floor(this.scrollPos) !== lastPos) this.$emit('scroll', this.scrollPos)

        const {
          margin,
          scrollTo,
          scrollPos,
          scrollHeight,
          scrollOffset
        } = this

        if (this.scrollTo === undefined) {

          // Scroll passed top
          if (scrollPos < margin - scrollOffset) {
            const dist = scrollPos - margin + scrollOffset
            this.velocity = dist * -0.1
          }

          // Scroll passed bottom
          if (scrollPos > scrollHeight - margin) {
            const dist = scrollPos - (scrollHeight - margin)
            this.velocity = dist * -0.1
          }
        } else {

          // Scroll to a position
          const dist = scrollPos - scrollTo
          this.velocity = dist * -0.1

          if (Math.floor(scrollPos) === Math.floor(scrollTo)) {
            this.scrollTo = undefined
          }
        }
      }

      requestAnimationFrame(this.update.bind(this))
    },

    // Setup

    setHeight () {
      const { itemHeight } = this

      if (itemHeight === undefined) {
        this.height = undefined
        this.provider.virtual = false
        return
      }

      this.height = itemHeight * this.$children.length
      this.provider.virtual = true
    },

    getViewportHeight () {
      let brect = this.$el.getBoundingClientRect()
      this.provider.viewportHeight = brect.height
      this.provider.scrollTop = this.scrollPos

      this.scrollHeight = this.$el.scrollHeight - brect.height
    },

    // API

    scrollToTop (fast) {
      if (!this.ready) {
        this.$nextTick(() => {
          this.scrollToTop(fast)
        })
        return
      }

      this.velocity = 0

      const { top } = this

      if (fast === true) {
        this.scrollPos = top
        return
      }
      this.scrollTo = top
    },

    scrollToBottom (fast) {
      if (!this.ready) {
        this.$nextTick(() => {
          this.scrollToBottom(fast)
        })
        return
      }

      this.velocity = 0

      let { top, bottom } = this

      if (bottom < 0) return
      if (bottom - top <= this.scrollOffset) bottom = top

      if (fast === true) {
        this.scrollPos = bottom
        return
      }
      this.scrollTo = bottom
    }
  },

  watch: {
    scrollPos (pos) {
      this.$el.scrollTop = pos
      this.provider.scrollTop = pos

      const { top, bottom, scrollOffset } = this

      this.scrolledToTop = (pos <= this.margin - this.scrollOffset - 2) // offset of 2 to account for rounding errors
      this.scrolledToBottom = (bottom - top <= scrollOffset) || (pos >= this.scrollHeight - this.margin - 2) // offset of 2 to account for rounding errors
    }
  }
}
</script>

<style lang="sass" scoped>
.list-view
  width: 100%
  height: 100%
  position: relative
  overflow: hidden
  touch-action: none

.list-view-inner
  width: 100%
  min-height: 100%
  position: relative
  display: flex
  flex-direction: column

.list-pull
  top: 0
  left: 0
  right: 0
  position: absolute
  pointer-events: none

.list-enter-active, .list-leave-active
  transition: all 1s

.list-enter, .list-leave-to
  opacity: 0
  transform: translateY(30px)

</style>
