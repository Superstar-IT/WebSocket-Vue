<template>
  <div class="control">
    <div class="message-card-item flex">
      <span class="icon is-soft flex-item">
        <span :class="`icon-${icon}`"></span>
      </span>
      <span class="flex-item">
        <slot />
      </span>
      <small v-if="$slots.status" class="flex-item is-aligned-right">
        <slot name="status" />
      </small>
      <tap v-if="actionIcon" class="action-icon flex is-centered" @click.native="$emit('action')">
        <span class="icon">
          <span :class="`icon-${actionIcon}`"></span>
        </span>
      </tap>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: 'hotdog'
    },
    actionIcon: {
      type: [ String, undefined ],
      default: undefined
    }
  }
}
</script>

<style lang="sass">
@import "@/styles/variables.sass"

.message-card-item
  font-size: $font-size-sm
  // line-height: 24px
  position: relative
  > .icon
    margin-right: $margin-sm
    transform: translateY(-1px)

.action-icon
  position: absolute
  bottom: -$margin
  right: -$margin
  color: $gabbi-pink
  padding: $margin
  font-size: 20px
</style>
