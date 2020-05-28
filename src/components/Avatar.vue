<template>
  <div :class="[ 'avatar', (small && 'is-small') ]">
    <div class="avatar-inner">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Avatar',

  props: {
    small: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.avatar
  width: 100%
  position: relative
  &.is-small
    .avatar-inner
      border-radius: $border-radius-sm

.avatar-inner
  width: 100%
  background: $gabbi-grey-2
  padding-top: 100%
  border-radius: $border-radius-lg

</style>
