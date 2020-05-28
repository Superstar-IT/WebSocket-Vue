<template>
  <gabbi-input :parent-props="$props" :input="input" :valid="valid" :invalid-message="invalidMessage">
    <select
      ref="input"
      :class="[ 'input', errors && 'is-danger' ]"
      :value="value"
      @change="input"
    >
      <slot />
    </select>
    <div class="select-icon">
      <span class="icon-chevron-down"></span>
    </div>
  </gabbi-input>
</template>

<script>
import GabbiInput from '@/components/form/GabbiInput.vue'
import gabbiInputProps from '@/mixins/gabbi-input-props.js'

export default {
  name: 'GabbiTextInput',

  mixins: [
    gabbiInputProps
  ],

  components: {
    GabbiInput
  },

  computed: {
    invalidMessage () {
      return ''
    }
  },

  methods: {
    input () {
      const el = this.$refs.input
      this.$emit('input', el.value.trim())
    },

    valid () {
      const el = this.$refs.input

      return {
        empty: this.required && el.value.trim() === ''
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.input
  padding-right: calc(0.75em + #{$icon-size})

.select-icon
  position: absolute
  right: 0.75em
  bottom: calc(0.375em + 1px)
</style>
