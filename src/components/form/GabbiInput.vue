<template>
  <div :class="[ 'control', hasIconsRight && 'has-icons-right', hasActionIcons && 'has-action-icons' ]">

    <label class="input-error" v-if="hasLabel && errors">
      <template v-if="errors.empty">{{ label }} is required.</template>
      <template v-else-if="errors.invalid">{{ invalidMessage }}</template>
    </label>

    <label class="input-label" v-else-if="hasLabel">
      {{ label }}<slot name="label" />
      <span class="input-required" v-if="required">*</span>
    </label>

    <slot />

  </div>
</template>

<script>
import gabbiInput from '@/mixins/gabbi-input.js'

export default {
  name: 'GabbiTextInput',

  inject: [
    'form',
    'formObject',
    'parentName'
  ],

  mixins: [
    gabbiInput
  ],

  props: {
    parentProps: {
      type: Object
    },

    input: {
      type: Function
    },

    valid: {
      type: Function
    },

    invalidMessage: {
      type: String,
      default: ''
    }
  },

  computed: {
    // Props

    label () {
      return this.parentProps.label
    },

    name () {
      return this.parentProps.name
    },

    index () {
      return this.parentProps.index
    },

    value () {
      return this.parentProps.value
    },

    required () {
      return this.parentProps.required
    },

    // Computed

    errors () {
      if (this.formObject && this.formObject.errors) {
        return this.formObject.errors[this.name || this.index]
      }

      if (this.form) {
        return this.form.errors[this.name || this.index]
      }

      if (this.parentProps.errors) {
        return this.parentProps.errors
      }
    },

    hasLabel () {
      return this.label || this.$slots.label
    },

    hasIconsRight () {
      return this.remove !== undefined
    },

    hasActionIcons () {
      return this.remove !== undefined
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/mixins.sass"
@import "@/styles/variables.sass"

.control
  flex: 1
  position: relative

.input-required
  color: $gabbi-pink
  margin: 0 0.2rem
  display: inline-flex
  font-weight: bold

.input-label,
.input-error
  top: calc(#{$margin} - 3px)
  left: 1rem
  z-index: 1
  position: absolute
  font-size: $font-size-sm
  pointer-events: none

.input-error
  color: $red

.input-label
  color: darken($gabbi-grey-0, 20)

.input-label,
.input-error
  + .input
    height: auto
    line-height: calc(40px - 0.375em)
    padding-top: calc(0.375em - 1px + 1rem)
</style>
