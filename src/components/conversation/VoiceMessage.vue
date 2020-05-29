<template>
  <div :class="`voice-message is-${type}`">
    <div class="voice-message-inner flex is-row">
      <audio ref="call" v-if="ready" controls autostart="0">
        <source :src="formats.ogg" type="audio/ogg">
        <source :src="formats.flac" type="audio/flac">
        <source :src="formats.wav" type="audio/wav">
        Your browser does not support audio playback.
      </audio>
      <template v-else>
        <div class="flex-item voice-message-button-outer">
          <tap-button :class="[ 'button', 'voice-message-button', (!call.recordingURL || status !== 'completed') && 'is-in-progress', loading && 'is-loading' ]" @click.native="playCall">
            <voice-message-triangle v-if="!loading" class="triangle" />
          </tap-button>
        </div>
        <div class="flex-item voice-message-info">
          <p v-if="error">Error loading message.</p>
          <p v-else-if="status === 'connecting'">Connecting...</p>
          <p v-else-if="status === 'in-progress'">In Progress...</p>
          <p v-else>Voice Message</p>
        </div>
        <div class="flex-item is-aligned-right">
          <tap-link v-if="status === 'in-progress'" class="voice-message-link" @click.native="$emit('show-call')">Show Call</tap-link>
          <!-- <tap-link v-else class="voice-message-link" @click.native="$emit('view-transcript')">Transcript</tap-link> -->
        </div>
      </template>
    </div>
  </div>
</template>

<script>
// import AudioPlayer from '@/components/AudioPlayer.vue'
import VoiceMessageTriangle from '@/assets/voice-message-triangle.svg'

export default {
  name: 'VoiceMessage',

  props: {
    type: {
      type: String,
      default: 'contact' // contact, agent
    },

    message: {
      type: Object,
      required: true
    }
  },

  components: {
    // AudioPlayer,
    VoiceMessageTriangle
  },

  data () {
    return {
      ready: false,
      error: false,
      loading: false
    }
  },

  computed: {
    call () {
      return this.message.attributes.call
    },

    status () {
      const { call } = this
      const status = call.status.status
      if(status)
        if (status === 'in-progress') {
          return 'in-progress'
        } else if (status === 'completed') {
          return 'completed'
        }
      else
        return 'completed'

      return 'connecting'
    },

    inProgress () {
      return false
    },

    formats () {
      const url = this.call.recordingURL

      return {
        wav: url.replace('.mp3', '.wav'),
        flac: url.replace('.mp3', '.flac'),
        ogg: url.replace('.mp3', '.ogg')
      }
    }
  },

  methods: {
    playCall () {
      this.ready = true
      this.$emit('playing-call', this)

      let callInterval = setInterval(() => {
        const { call } = this.$refs

        if (call) {
          clearInterval(callInterval)

          call.onerror = (err) => {
            this.error = err
            console.warn(err)
          }

          this.$refs.call.play()
        }

        if (!this.ready) {
          clearInterval(callInterval)
        }
      }, 100)
    },

    hideCall () {
      this.ready = false
      if (this.$refs.call) this.$refs.call.pause()
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.voice-message
  padding: 1rem
  background: rgba(0,0,0,0.05)
  border-radius: 25px
  &.is-agent
    color: #fff
    a,
    small
      color: #fff !important
    .voice-message-button.button
      box-shadow: 0 $shadow-offset $shadow-blur rgba($gabbi-navy, 0.2) !important
      &:focus,
      &:active
        box-shadow: 0 $shadow-offset $shadow-blur rgba($gabbi-navy, 0.2) !important
  &.is-contact
    .voice-message-button.button
      box-shadow: 0 $shadow-offset $shadow-blur $shadow-grey !important
      &:focus,
      &:active
        box-shadow: 0 $shadow-offset $shadow-blur $shadow-grey !important

.voice-message-inner
  width: 100%

.voice-message-button-outer
  min-width: 50px
  max-width: 50px
  margin-right: 1rem

.voice-message-info
  margin-right: 2rem

.voice-message-button.button
  width: 50px
  height: 50px
  padding: 0
  background: $gabbi-white
  border-color: $gabbi-white
  border-radius: $border-radius-lg
  .triangle
    margin-left: 1px
    transition: all $tx-duration-sm $tx-ease
  &.is-in-progress
    pointer-events: none
    .triangle
      filter: grayscale(100%)
      opacity: 0.2

.voice-message-link
  text-decoration: underline

</style>
