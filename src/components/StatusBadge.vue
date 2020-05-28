<template>
  <div class="status-badge tag">
    <slot />
  </div>
</template>

<style lang="sass" scoped>
@import '@/styles/variables.sass'

.tag:not(body)
  color: $gabbi-white
  width: 100px
  height: 1.5rem
  padding: 0 0.5rem
  font-size: $font-size-sm
  background: transparent
  font-weight: normal
  line-height: 1.5rem
  border-radius: $border-radius-x-sm
  background: $gabbi-navy

</style>
