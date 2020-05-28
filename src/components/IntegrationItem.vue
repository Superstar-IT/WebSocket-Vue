<template>
  <div class="integration-item">
    <div class="flex is-row">
      <div class="flex-item" style="min-width:40px;max-width:40px">
        <div :class="{ 'integration-icon': true, 'is-connected': connected, 'flex': true, 'is-row': true, 'is-centered': true }" :style="iconStyle">
          <div class="flex-item">
            <slot name="icon" :connected="connected" />
          </div>
        </div>
      </div>
      <div class="flex-item flex is-column">
        <span>{{ name }}</span>
        <small v-if="connected" class="is-soft">{{ connected }}</small>
        <small v-else class="is-soft">Not connected</small>
      </div>
      <div class="flex-item is-aligned-right">
        <!-- <tap-link v-if="connected" class="link is-soft" @click.native="$emit('disconnect')">Disconnect</tap-link> -->
        <tap-link v-if="!connected" class="link" @click.native="$emit('connect')">Connect</tap-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IntegrationItem',

  props: {
    name: {
      type: String,
      default: '',
      required: true
    },

    color: {
      type: String,
      default: '#E05EAA'
    },

    connected: {
      type: [ String, undefined ],
      default: undefined
    }
  },

  computed: {
    iconStyle () {
      if (!this.connected) return {}

      return {
        color: this.color,
        backgroundColor: this.color
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.integration-item
  width: 100%
  margin-bottom: $margin
  &:last-child
    margin-bottom: 0
  > .flex > .flex-item
    margin-right: $margin
    &:last-child
      margin-right: 0

.integration-icon
  width: 40px
  height: 40px
  z-index: 1
  position: relative
  transition: all $tx-duration
  background: $gabbi-grey-2
  border-radius: $border-radius
  &::before
    top: 0
    left: 0
    width: 100%
    height: 100%
    content: ''
    display: block
    opacity: 0
    position: absolute
    transition: all $tx-duration
    box-shadow: 0 $shadow-offset $shadow-blur
    border-radius: $border-radius

  .flex-item
    color: $gabbi-grey-0
    font-size: 0
    > *
      font-size: 16px
  &.is-connected
    &::before
      opacity: 0.4
    .flex-item
      color: #fff !important
</style>
