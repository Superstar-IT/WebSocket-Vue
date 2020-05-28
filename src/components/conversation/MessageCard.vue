<template>
  <div class="conversation-message-card">
    <div :class="`conversation-message-card-inner is-${type}`">
      <h4 v-if="title"><strong>{{ title }}</strong></h4>
      <slot />
    </div>
    <div v-if="type === 'action'" class="conversation-message-card-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'default' // default, card, action
    },
    title: {
      type: [ String, undefined ],
      default: undefined
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.conversation-message-card
  padding: 0 $margin

/deep/
  .conversation-message-card-inner
    padding: 1rem
    border-radius: $border-radius
    &.is-default
      border: solid 1px $gabbi-grey-1
    &.is-card
      background: $gabbi-white
      box-shadow: 0 $shadow-offset-lg $shadow-blur-lg $shadow-grey
    &.is-action
      color: $gabbi-pink
      background: rgba($gabbi-pink, 0.2)
      margin-bottom: 2px
      border-bottom-left-radius: 0
      border-bottom-right-radius: 0
      hr
        background-color: rgba($gabbi-pink, 0.2)
      strong
        color: $gabbi-pink !important
      .is-soft
        color: rgba($gabbi-pink, 0.6) !important

h4
  margin-bottom: $margin

hr
  margin: $margin -1rem
  height: 1px
  background-color: $gabbi-grey-2
</style>
