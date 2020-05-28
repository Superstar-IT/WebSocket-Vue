<template>
  <p class="status-message is-soft">
    <small><slot /></small>
  </p>
</template>

<script>
export default {
  name: 'StatusMessage'
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.status-message
  margin: $margin-x-lg auto
  padding: 0 1rem
  line-height: 1.1
  text-align: center
  &:last-child
    margin-bottom: $margin-x-lg

</style>
