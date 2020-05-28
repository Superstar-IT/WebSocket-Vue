<template>
  <div :class="[ 'dropdown', 'is-active', (alignedRight && 'is-right'), (alignedUp && 'is-up') ]">
    <div class="dropdown-trigger">
      <tap @click.native="toggleDropdown"><slot /></tap>
    </div>
    <animeta-transition :to="{ scale: 1, opacity: 1, elasticity }" :from="{ scale: 0.5, opacity: 0, elasticity: 0 }" :options="{ duration }">
      <div ref="dropdownContent" class="dropdown-menu" role="menu" v-if="active">
        <div class="dropdown-content">
          <slot name="content" />
        </div>
      </div>
    </animeta-transition>
  </div>
</template>

<script>
import constants from '@/constants.js'

export default {
  name: 'Dropdown',

  props: {
    alignedRight: {
      type: Boolean,
      default: false
    },

    alignedUp: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      active: false,
      clickHandler: undefined
    }
  },

  computed: {
    duration () {
      return constants.transitions.duration.medium
    },

    elasticity () {
      return constants.transitions.elasticity
    }
  },

  destroyed () {
    if (this.clickHandler) document.removeEventListener('click', this.clickHandler)
  },

  methods: {
    toggleDropdown () {
      if (this.active) return

      this.active = true

      this.$nextTick(() => {
        if (this.clickHandler) document.removeEventListener('click', this.clickHandler)

        this.clickHandler = () => {
          document.removeEventListener('click', this.clickHandler)
          setTimeout(() => { this.active = false }, 10)
        }

        document.addEventListener('click', this.clickHandler)
      })
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.dropdown
  &.is-up
    .dropdown-menu
      transform-origin: 0 100%
  &.is-right
    .dropdown-menu
      transform-origin: 100% 0
    &.is-up
      .dropdown-menu
        transform-origin: 100% 100%

.dropdown-menu
  opacity: 0
  transform: scale(0.5)

.dropdown-content
  box-shadow: 0 $shadow-offset-lg $shadow-blur-lg $shadow-grey
  border-radius: $border-radius
</style>
