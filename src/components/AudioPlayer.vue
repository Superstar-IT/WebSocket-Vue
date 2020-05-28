<template>
  <div class="audio-player">
    <audio controls>
      <source :src="src" :type="type">
      Your browser does not support audio playback.
    </audio>
  </div>
</template>

<script>
export default {
  name: 'AudioPlayer',

  props: {
    src: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'audio/mpeg'
    }
  }
}
</script>

<style lang="sass" scoped>
.audio-player
  width: 100%
  position: relative
  audio
    width: 100%
    display: block
</style>
