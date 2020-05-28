<template>
  <div class="app-filter-bar">
    <div class="app-filter-bar-inner flex is-row">
      <div class="flex-item flex is-row app-filter-bar-tabs" ref="tabs">
        <slot />
        <div class="selected-tab" v-if="activeTab !== undefined" ref="selected"></div>
      </div>
      <div class="flex-item is-aligned-right">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script>
import anime from 'animejs'
import constants from '@/constants.js'

export default {
  name: 'AppFilterBar',

  props: {
    activeTab: {
      type: [ Number, undefined ],
      default: undefined
    }
  },

  mounted () {
    this.changeSelected(this.activeTab)
  },

  methods: {
    changeSelected (index) {
      this.$nextTick(() => {
        let tab = this.$slots.default[index]

        if (!tab) return
        const el = tab.componentInstance.$el

        const offsetX = Math.round(this.$refs.tabs.getBoundingClientRect().left)

        const brect = el.getBoundingClientRect()
        const width = Math.round(brect.width)
        const left = Math.round(brect.left) - offsetX

        const { duration, elasticity } = constants.transitions

        anime.remove(this.$refs.selected)
        anime({
          width,
          targets: this.$refs.selected,
          duration: duration.fast,
          elasticity,
          translateX: left,
        })
      })
    }
  },

  watch: {
    activeTab (index) {
      this.changeSelected(index)
    }
  },

  FILTER_BAR_HEIGHT: 34
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.app-filter-bar
  height: $FILTER_BAR_HEIGHT
  padding: 0 $margin-lg
  font-size: $font-size-sm

.app-filter-bar-inner
  width: 100%
  height: 100%
  position: relative

.app-filter-bar-tabs
  position: relative

.selected-tab
  left: 0
  bottom: 0
  height: 3px
  position: absolute
  background: $gabbi-pink
</style>
