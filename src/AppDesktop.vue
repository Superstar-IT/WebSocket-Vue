<template>
  <div id="app" class="app-desktop">
    Desktop
  </div>
</template>

<script>
import app from '@/mixins/app.js'

export default {
  mixins: [ app ],
  components: {}
}
</script>

<style lang="sass" scoped>
@import "@/styles/app.sass"
.app-desktop
</style>
