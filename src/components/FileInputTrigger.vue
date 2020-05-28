<template>
  <label class="file-input-trigger">
    <input
      ref="input"
      type="file"
      :accept="accept"
      :multiple="multiple"
      @change="change"
    />
  </label>
</template>

<script>
export default {
  name: 'FileInputTrigger',

  props: {
    accept: {
      type: String,
      default: '*'
    },

    multiple: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    change (evt) {
      this.$emit('change', evt.target.files)
      // evt.target.value = ''
    }
  }
}
</script>

<style lang="sass">
.file-input-trigger
  top: 0
  left: 0
  width: 100%
  height: 100%
  display: block
  position: relative
  font-size: 0
  input
    width: 100%
    height: 100%
    opacity: 0
</style>
