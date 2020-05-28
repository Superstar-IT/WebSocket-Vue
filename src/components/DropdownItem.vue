<template>
  <component :is="tag" :class="[ 'dropdown-item', (active && 'is-active') ]">
    <slot />
    <span class="dropdown-item-control flex is-row">
      <slot name="control"></slot>
    </span>
  </component>
</template>

<script>
export default {
  name: 'DropdownItem',

  props: {
    tag: {
      type: String,
      default: 'a'
    },
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.dropdown-item
  color: $gabbi-navy
  padding: 0.5rem 1rem
  position: relative

.dropdown-item-control
  top: 0
  right: 1rem
  bottom: 0
  position: absolute
</style>
