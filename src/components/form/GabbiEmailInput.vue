<template>
  <gabbi-input :parent-props="$props" :input="input" :valid="valid" :invalid-message="invalidMessage">
    <input
      ref="input"
      type="email"
      autocomplete="disabled"
      :class="[ 'input', errors && 'is-danger', $slots.default && 'has-icon' ]"
      :value="value"
      :placeholder="placeholder"
      @input="input"
    />
    <div class="input-icon">
      <slot />
    </div>
  </gabbi-input>
</template>

<script>
import GabbiInput from '@/components/form/GabbiInput.vue'
import gabbiInputProps from '@/mixins/gabbi-input-props.js'

export default {
  name: 'GabbiEmailInput',

  mixins: [
    gabbiInputProps
  ],

  components: {
    GabbiInput
  },

  props: {
    canRemove: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    invalidMessage () {
      return 'Invalid email.'
    }
  },

  methods: {
    input () {
      const el = this.$refs.input
      this.$emit('input', el.value.trim())
    },

    valid () {
      const el = this.$refs.input
      const value = el.value.trim()

      const empty = this.required && value === ''

      const regex = /[^\s]+@[^\s]+\.[^\s]+/g
      const invalid = value !== '' && value.match(regex) === null

      return {
        empty,
        invalid
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.input
  &.has-icon
    padding-right: calc(0.75em + #{$icon-size})

.input-icon
  position: absolute
  right: 0.75em
  bottom: calc(0.375em + 1px)
</style>
