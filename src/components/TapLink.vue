<template>
  <a @click="openLink"><slot /></a>
</template>

<script>
export default {
  name: 'TapLink',

  props: {
    href: {
      type: [ String, undefined ],
      default: undefined
    },

    external: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    openLink (evt) {
      evt.preventDefault()

      if (this.external && this.href) {
        window.open(this.href, '_blank')
      }
    }
  }
}
</script>
