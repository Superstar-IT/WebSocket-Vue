<template>
  <div :class="{ 'app-tabs': true, 'flex': true, 'is-centered': true, 'has-notch': hasNotch }">
    <!-- <app-tab-button to="/" icon="list3" class="flex-item" :selected="tabSelected === 'hints'" /> -->
    <app-tab-button to="/" icon="bubbles" class="flex-item" :selected="tabSelected === 'conversations'" />
    <app-tab-button to="/contacts" icon="users2" class="flex-item" :selected="tabSelected === 'contacts'" />
    <!-- <app-tab-button to="/" icon="trophy" class="flex-item" :selected="tabSelected === 'goals'" /> -->
  </div>
</template>

<script>
import AppTabButton from '@/components/mobile/AppTabButton.vue'

export default {
  name: 'AppTabs',

  components: {
    AppTabButton
  },

  computed: {
    hasNotch () {
      return this.$store.getters.hasNotch
    },

    tabSelected () {
      return this.$route.meta.view
    }
  },

  TAB_HEIGHT: 50,
  TAB_HEIGHT_NOTCH: 50
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.app-tabs
  width: 100%
  height: $TAB_HEIGHT
  position: relative
  min-height: $TAB_HEIGHT
  background: $gabbi-white
  &.has-notch
    height: $TAB_HEIGHT_NOTCH
    min-height: $TAB_HEIGHT_NOTCH
    padding-bottom: ($TAB_HEIGHT_NOTCH - $TAB_HEIGHT)
  &::before
    top: 0
    left: 0
    right: 0
    height: $shadow-blur
    z-index: 1
    content: ''
    position: absolute
    transform: translateY(-100%)
    background: linear-gradient(rgba($shadow-grey, 0), $shadow-grey)
    pointer-events: none

.flex-item
  margin: auto
</style>
