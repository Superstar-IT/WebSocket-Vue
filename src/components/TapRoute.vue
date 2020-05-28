<template>
  <a @click="changeRoute"><slot /></a>
</template>

<script>
export default {
  name: 'TapRoute',

  props: {
    to: {
      type: String,
      default: '/'
    }
  },

  methods: {
    changeRoute (evt) {
      evt.preventDefault()

      this.$route.push({ path: this.to })
    }
  }
}
</script>
