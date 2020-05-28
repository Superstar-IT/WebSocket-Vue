<template>
  <div class="modal-outer">
    <div class="modal is-active">

      <animeta-transition :to="{ opacity: 0.85 }" :from="{ opacity: 0 }" :options="{ duration: 150, easing: 'linear' }">
        <div v-if="visible" class="modal-background"></div>
      </animeta-transition>

      <animeta-transition
        :to="{ scale: 1, opacity: 1 }"
        :from="{ scale: 0.5, opacity: 0 }"
        :options="{ easing: 'linear', duration: 150 }"
      >
        <close-button v-if="visible" class="modal-close-button" :inverted="true" @click.native="$emit('close')" />
      </animeta-transition>

      <animeta-transition :to="{ translateY: '0%' }" :from="{ translateY: '100%' }" :options="{ duration: 600, elasticity: 0 }">
        <div v-if="visible" class="flex is-column modal-content">

          <div class="flex-item media-preview">
            <div class="media" :style="`background-image:url('${media.mediaUrl}')`">
              <div v-if="loading" class="loading"></div>
            </div>
          </div>

          <div class="flex-item media-message-bar">
            <div class="message-bar flex is-row">
              <div class="flex-item control is-message">
                <input v-model="message" @keyup.enter="send" placeholder="Add a caption..." type="text" class="input message-input" :disabled="loading" />
              </div>
              <div class="flex-item control">
                <tap-button class="button is-icon is-primary-inverted" @click.native="send" :disabled="loading">
                  <span class="icon">
                    <span class="icon-paper-plane"></span>
                  </span>
                </tap-button>
              </div>
            </div>
          </div>

        </div>
      </animeta-transition>

    </div>
  </div>
</template>

<script>
import CloseButton from '@/components/CloseButton.vue'

export default {
  name: 'SendMediaModal',

  components: {
    CloseButton
  },

  props: {
    media: {
      type: [ Object, undefined ],
      default: undefined
    },

    visible: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      message: '',
      loading: false
    }
  },

  methods: {
    send () {
      this.loading = true

      const payload = {
        message: this.message || undefined,
        ...this.media
      }

      this.$emit('send', payload)
    }
  },

  watch: {
    visible (visible) {
      if (!visible) this.loading = false
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"
@import "@/styles/mixins.sass"
@import "@/styles/variables.sass"

$input-height: calc(#{$MESSAGE_BAR_HEIGHT} - #{$margin})

.modal-outer
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 1
  position: absolute
  pointer-events: none

.modal-background
  background-color: rgba(desaturate($gabbi-navy, 15), 0.9)

.modal-content
  width: 100%
  height: 100%
  max-height: none
  margin: 0
  position: relative
  pointer-events: auto

.modal-close-button
  position: absolute
  top: $margin-sm
  right: $margin-sm
  z-index: 2
  pointer-events: auto

.media-preview
  flex: 1
  padding: $margin-lg
  padding-bottom: 0
  position: relative

.media-message-bar
  padding: $margin-lg

.message-bar
  .control
    &.is-message
      flex: 1
      margin-right: 1rem
  .input
    height: $input-height
    line-height: $input-height
    box-shadow: 0 $shadow-offset $shadow-blur rgba(0,0,0,0.2)
    &:focus,
    &:hover
      box-shadow: 0 $shadow-offset $shadow-blur rgba(0,0,0,0.2)
      border-color: $gabbi-white
  .button
    width: $input-height !important
    height: $input-height !important
    padding: 0 $margin-sm
    line-height: $input-height
    &:focus,
    &:hover
      border: none
  .input,
  .button
    &:disabled
      opacity: 0.6

.media
  width: 100%
  height: 100%
  background-size: contain
  background-repeat: no-repeat
  background-position: 50% 50%

.loading
  width: 20px
  height: 20px
  top: 50%
  left: 50%
  position: absolute
  margin: 0 0 0 -10px
  +loader
</style>
