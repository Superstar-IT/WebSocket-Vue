<template>
  <label class="input-radio">
    <input type="radio" :name="name" :value="value" :checked="checked" @change="changed" />
    <span></span>
  </label>
</template>

<script>
export default {
  name: 'InputRadio',

  props: {
    name: {
      type: String,
      default: ''
    },
    value: {
      type: null,
      default: undefined
    },
    checked: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    changed (evt) {
      if (evt.target.checked) this.$emit('change', this.value)
    }
  }
}
</script>

<style lang="sass" scoped>
// @import "@/styles/variables.sass"

// .input-radio
</style>
