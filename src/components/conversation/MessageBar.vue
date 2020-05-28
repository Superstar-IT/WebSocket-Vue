<template>
  <div :class="classes">
    <div class="message-bar-inner flex is-row">

      <!-- Left actions -->

      <div class="flex-item message-bar-action is-left flex is-row">

        <!-- Call -->

        <tap-button :class="[ 'button', 'is-icon', 'is-inline', 'is-medium', (call !== undefined && 'is-in-progress') ]" @click.native="() => { call !== undefined ? showCall() : startCall() }">
          <span class="icon">
            <span class="icon-telephone"></span>
          </span>
        </tap-button>

      </div>

      <!-- Input -->

      <div class="flex-item message-bar-input">

        <!-- Can send message -->

        <tap v-if="mode === 'action'" class="input-status is-action" @click.native="showPendingAction">
          I need your feedback.
        </tap>

        <div v-else class="control">
          <input v-model="message" @keyup.enter="sendMessage" type="text" class="input message-input" />
        </div>
      </div>

      <!-- Right actions -->

      <div class="flex-item message-bar-action is-right flex is-row">

        <!-- Add attachment -->

        <!--
        <tap-button class="button is-icon is-inline is-medium" @click.native="addAttachment">
          <span class="icon">
            <span class="icon-paperclip"></span>
          </span>
        </tap-button>
        -->

        <template v-if="connected && mode !== 'empty'">

          <!-- Send message -->

          <tap-button class="button is-icon is-primary" @click.native="sendMessage" key="send-button">
            <span class="icon">
              <span class="icon-paper-plane"></span>
            </span>
          </tap-button>

        </template>

        <template v-else>

          <!-- Send menu -->

          <tap-button class="button is-icon is-inline is-medium" @click.native="showMessageActions">
            <span class="icon">
              <span class="icon-ellipsis"></span>
            </span>
          </tap-button>

          <tap-button class="button is-icon is-primary is-disabled" disabled key="send-button">
            <span class="icon">
              <span class="icon-paper-plane"></span>
            </span>
          </tap-button>

        </template>

      </div>

    </div>
  </div>
</template>

<script>
const MESSAGE_BAR_HEIGHT = 44

export default {
  name: 'MessageBar',

  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      mode: 'empty',
      message: ''
    }
  },

  computed: {
    call () {
      return this.$store.state.calls.call
    },

    classes () {
      return [
        'message-bar',
        this.callsDisabled && 'has-calls-disabled',
        this.actionsDisabled && 'has-actions-disabled',
        this.messageDisabled && 'has-message-disabled'
      ]
    },

    callsDisabled () {
      return this.mode === 'call' || this.mode === 'action' || this.loading
    },

    actionsDisabled () {
      return this.mode === 'action' || this.loading
    },

    messageDisabled () {
      return this.loading
    },

    connected () {
      return this.$store.state.connected
    }
  },

  methods: {
    reset () {
      this.message = ''
    },

    startCall () {
      this.$emit('start-call')
    },

    showCall () {
      this.$store.dispatch('calls/toggleShow')
    },

    sendMessage () {
      const message = this.message.trim()
      if (!message) return

      this.$emit('send-message', message)
    },

    addAttachment () {
    },

    showPendingAction () {
    },

    showMessageActions () {
      this.$emit('show-actions')
    }
  },

  created () {
    const self = true
    const { call } = this

    if (call !== undefined && self) this.mode = 'call-self'
    else if (call !== undefined && !self) this.mode = 'call-other'
  },

  watch: {
    call (call) {
      const self = true

      if (call !== undefined && self) this.mode = 'call-self'
      else if (call !== undefined && !self) this.mode = 'call-other'
    },

    message (text) {
      const self = true

      if (this.call !== undefined && self) this.mode = 'call-self'
      else if (this.call !== undefined && !self) this.mode = 'call-other'
      else if (text.trim().length === 0) this.mode = 'empty'
      else this.mode = 'typing'
    }
  },

  MESSAGE_BAR_HEIGHT
}
</script>

<style lang="sass" scoped>
@import '@/styles/variables.sass'

$input-height: calc(#{$MESSAGE_BAR_HEIGHT} - #{$margin})

.message-bar
  height: $MESSAGE_BAR_HEIGHT
  position: relative
  min-height: $MESSAGE_BAR_HEIGHT
  padding: 0 $margin
  &::before
    top: 0
    left: 0
    right: 0
    height: $shadow-blur
    z-index: 1
    content: ''
    opacity: 0.1
    position: absolute
    transform: translateY(-100%)
    background: linear-gradient(rgba($gabbi-navy, 0), $gabbi-navy)
    pointer-events: none
  &.has-calls-disabled
    .message-bar-action.is-left
      pointer-events: none
      .button
        color: $gabbi-grey-0
  &.has-actions-disabled
    .message-bar-action.is-right
      pointer-events: none
      .button
        color: $gabbi-grey-0
  &.has-message-disabled
    .message-bar-input
      pointer-events: none
      .input
        color: $gabbi-grey-0

.message-bar-inner
  width: 100%
  height: 100%

.message-bar-action
  .button
    width: $input-height !important
    height: $input-height !important
    padding: 0 $margin-sm
    line-height: $input-height
  &.is-left
    .button
      margin-right: $margin-sm
  &.is-right
    .button
      margin-left: $margin-sm

.message-bar-input
  flex: 1
  width: 100%
  padding: 0 $margin-sm
  .input
    transition: border-color $tx-duration-sm $tx-ease, box-shadow $tx-duration-sm $tx-ease, background-color $tx-duration-sm $tx-ease, color $tx-duration-sm $tx-ease
  .input,
  .input-status
    height: $input-height
    line-height: $input-height

.input-status
  color: $gabbi-white
  text-align: center
  transition: transform $tx-duration-sm $tx-ease
  border-radius: $border-radius-sm
  &:active
    transform: translate3d(0, 3%, 0)
  &.is-call
    background: $gabbi-teal
    box-shadow: 0 $shadow-offset $shadow-blur rgba($gabbi-teal, 0.4)
  &.is-action
    background: $gabbi-pink
    box-shadow: 0 $shadow-offset $shadow-blur rgba($gabbi-pink, 0.4)

.button.is-in-progress
  width: $input-height !important
  height: $input-height !important
  padding: 0 $margin-sm
  background: $gabbi-teal
  line-height: $input-height
  border-radius: 11px
  animation-name: button-pulse
  animation-duration: 2s
  animation-iteration-count: infinite
  .icon
    color: $gabbi-white
    font-size: 16px

@keyframes button-pulse
  from
    box-shadow: 0 0 0 0 rgba($gabbi-teal, 0.65)
  to
    box-shadow: 0 0 0 8px rgba($gabbi-teal, 0)
</style>
