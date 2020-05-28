<template>
  <div class="empty-view flex is-column is-centered">
    <slot name="img" />
    <p>
      <slot />
    </p>
  </div>
</template>

<script>
export default {
  name: 'EmptyView'
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.empty-view
  z-index: 1
  width: 270px
  height: 270px
  position: relative
  text-align: center
  background: radial-gradient($gabbi-grey-3, rgba($gabbi-grey-3, 0) 65%)
  img
    margin-bottom: $margin-lg

</style>
