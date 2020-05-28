<template>
  <div class="lightbox">

    <!-- Background overlay -->
    <animeta-transition
      :to="{ opacity: 1 }"
      :from="{ opacity: 0 }"
      :options="{ easing: 'linear', duration: 150 }"
    >
      <tap v-if="src" class="lightbox-background" @click.native="close"></tap>
    </animeta-transition>

    <!-- Close button -->
    <animeta-transition
      :to="{ scale: 1, opacity: 1 }"
      :from="{ scale: 0.5, opacity: 0 }"
      :options="{ easing: 'linear', duration: 150 }"
    >
      <div v-if="src" class="lightbox-close">
        <tap-button class="button is-icon" @click.native="close">
          <span class="icon-cross"></span>
        </tap-button>
      </div>
    </animeta-transition>

    <!-- Lightbox content -->
    <div v-if="src" ref="inner" class="lightbox-inner flex">
      <div class="flex-item lightbox-content flex">
        <animeta-transition
          :to="{ scale: 1, opacity: 1 }"
          :from="{ scale: 0.8, opacity: 0 }"
          :options="{ easing: 'easeInOutQuad', duration: 150 }"
        >
          <tap tag="img"
            v-if="!loading"
            ref="img"
            :src="src"
            :class="`flex-item is-${orientation}`"
            :style="imgStyle"
            @click.native="expand"
          />
        </animeta-transition>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Lightbox',

  props: {
    src: {
      type: [ String, undefined ],
      default: undefined
    }
  },

  data () {
    return {
      image: undefined,
      loading: true,
      expanded: false,

      // Scaled/display size
      width: 0,
      height: 0,

      // Real size of the image
      imageWidth: 0,
      imageHeight: 0,

      // Real size of the container
      innerWidth: 0,
      innerHeight: 0,

      padding: 20,
      orientation: 'landscape' // portrait, landscape, square
    }
  },

  mounted () {
    if (this.src) this.bindLoad()
  },

  updated () {
    if (this.src) this.bindLoad()
  },

  computed: {
    imgStyle () {

      if (this.expanded) {
        const { imageWidth, imageHeight } = this

        return {
          width: imageWidth + 'px',
          height: imageHeight + 'px'
        }
      }

      const { width, height } = this

      return {
        width: width + 'px',
        height: height + 'px'
      }
    },

    paddedWidth () {
      return this.innerWidth - (this.padding * 2)
    },

    paddedHeight () {
      return this.innerHeight - (this.padding * 2)
    }
  },

  methods: {
    close () {
      this.loading = true
      this.expanded = false
      this.$emit('close')
    },

    bindLoad () {
      this.image = new Image()
      this.image.onload = this.imageLoaded.bind(this)
      this.image.src = this.src
    },

    imageLoaded () {
      const img = this.image

      this.imageWidth = img.width
      this.imageHeight = img.height

      if (img.width >= img.height) this.orientation = 'landscape'
      else this.orientation = 'portrait'

      this.resizeImage()

      this.loading = false
    },

    resizeImage () {
      const brect = this.$el.getBoundingClientRect()
      this.innerWidth = brect.width
      this.innerHeight = brect.height

      switch (this.orientation) {
        case 'square': return this.resizeSquare()
        case 'portrait': return this.resizePortrait()
        case 'landscape': return this.resizeLandscape()
      }
    },

    resizePortrait () {
      const {
        imageWidth,
        imageHeight,
        paddedWidth,
        paddedHeight
      } = this

      if (imageWidth < paddedWidth) {
        const ratio = imageWidth / imageHeight

        this.width = paddedHeight * ratio
        this.height = paddedHeight
      } else {
        const ratio = imageHeight / imageWidth

        this.width = paddedWidth
        this.height = paddedWidth * ratio
      }
    },

    resizeLandscape () {
      const {
        imageWidth,
        imageHeight,
        paddedWidth,
        paddedHeight
      } = this

      if (imageWidth > paddedWidth) {
        const ratio = imageHeight / imageWidth

        this.width = paddedWidth
        this.height = paddedWidth * ratio
      } else {
        const ratio = imageWidth / imageHeight

        this.width = paddedHeight * ratio
        this.height = paddedHeight
      }
    },

    expand () {
      if (this.expanded) return this.expanded = false

      this.expanded = true

      this.$nextTick(() => {
        this.$refs.inner.scrollLeft = (this.$refs.inner.scrollWidth - this.width) / 2
        this.$refs.inner.scrollTop = (this.$refs.inner.scrollHeight - this.height) / 2
      })
    }
  }
}
</script>

<style lang="sass">
@import "@/styles/variables.sass"

.lightbox
  top: 0
  left: 0
  color: $gabbi-white
  width: 100%
  height: 100%
  position: absolute
  pointer-events: none

.lightbox-close
  top: $margin
  right: $margin
  z-index: 3
  position: absolute
  .button
    width: 30px
    height: 30px
    padding: 0
    pointer-events: auto

.lightbox-inner
  width: 100%
  height: 100%
  overflow: auto
  position: relative
  z-index: 1
  pointer-events: auto

.lightbox-background
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 1
  position: absolute
  pointer-events: auto
  background-color: rgba(desaturate($gabbi-navy, 15), 0.9)

.lightbox-content
  margin: auto
  z-index: 2
  position: relative
  img
    width: 100%
    margin: 20px
    max-width: none
    background-color: $gabbi-navy
    box-shadow: 0 $shadow-offset ($shadow-blur-lg * 3) rgba(desaturate($gabbi-navy, 15), 0.4)
</style>
