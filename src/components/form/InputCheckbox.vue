<template>
  <label :class="{ 'input-checkbox': true, [`is-${type}`]: true, 'is-slim': slim }">
    <input type="checkbox" :checked="checked" @change="change" />
    <span></span>
  </label>
</template>

<script>
export default {
  name: 'InputCheckbox',

  props: {
    name: {
      type: [ String, undefined ],
      default: undefined
    },

    slim: {
      type: Boolean,
      default: true
    },

    type: {
      type: String,
      default: 'primary' // 'primary', 'secondary'
    },

    valueOn: {
      type: null,
      default: true
    },

    valueOff: {
      type: null,
      default: false
    },

    checked: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    change (evt) {
      this.$emit('change', evt)
      this.$emit('input', evt.target.checked ? this.valueOn : this.valueOff)
    }
  }
}
</script>

<style lang="sass">
@import "@/styles/variables.sass"

.input-radio,
.input-checkbox
  display: inline-flex
  &:not(.is-slim)
      padding: $margin
  span
    width: 18px
    height: 18px
    border: solid 1px
    display: inline-block
    border-radius: 7px
    transition: all $tx-duration-sm $tx-ease
    transform: translate3d(0, 0%, 0)
    &:active
      transform: translate3d(0, 6%, 0)
  input
    position: absolute
    visibility: hidden
    pointer-events: none
  input:checked
    + span
      background: $gabbi-pink
      border-color: $gabbi-pink
      box-shadow: 0 $shadow-offset-sm $shadow-blur-sm $gabbi-pink
  &.is-primary
    span
      border-color: rgba(#000, 0.15)
      box-shadow: 0 0 0 $gabbi-pink
    input:checked
      + span
        background: $gabbi-pink
        border-color: $gabbi-pink
        box-shadow: 0 $shadow-offset-sm $shadow-blur-sm $gabbi-pink
  &.is-secondary
    span
      border-color: lighten(darken($gabbi-teal, 10), 30)
      box-shadow: 0 0 0 $gabbi-teal
    input:checked
      + span
        background: $gabbi-teal
        border-color: $gabbi-teal
        box-shadow: 0 $shadow-offset-sm $shadow-blur-sm $gabbi-teal
</style>
