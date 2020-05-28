<template>
  <a :class="[ 'link-component', icon === 'plus' && 'is-create' ]" :href="href">
    <span class="icon">
      <span :class="`icon-${icon}`"></span>
    </span>
    <span>
      <slot />
    </span>
    <small class="is-soft" v-if="$slots.label">
      <slot name="label" />
    </small>
  </a>
</template>

<script>
export default {
  name: 'IconLink',

  props: {
    href: {
      type: [ String, undefined ],
      default: undefined
    },
    icon: {
      type: String,
      default: 'plus'
    }
  }
}
</script>

<style lang="sass" scoped>
@import '@/styles/variables.sass'

.link-component
  padding: $margin-sm 0
  display: inline-flex
  align-items: center
  > span:not(.icon)
    text-decoration: underline
  .icon
    margin-right: $margin-sm
  &.is-create
    .icon
      color: $gabbi-pink
  &:not(.is-create)
    .icon
      color: $gabbi-grey-0
  small
    display: inline-block
    margin-left: auto

</style>
