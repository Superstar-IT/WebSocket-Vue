<template>
  <gabbi-input :parent-props="$props" :input="input" :valid="valid" :invalid-message="invalidMessage">
    <input
      ref="input"
      type="password"
      autocomplete="disabled"
      :class="[ 'input', errors && 'is-danger' ]"
      :value="value"
      :placeholder="placeholder"
      @input="input"
    />
  </gabbi-input>
</template>

<script>
import GabbiInput from '@/components/form/GabbiInput.vue'
import gabbiInputProps from '@/mixins/gabbi-input-props.js'

export default {
  name: 'GabbiPasswordInput',

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
      this.$emit('input', el.value)
    },

    valid () {
      const el = this.$refs.input

      return {
        empty: el.value === ''
      }
    }
  }
}
</script>
