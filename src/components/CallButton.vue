<template>
  <div class="call-button-outer">
    <transition name="button">
      <div v-if="!hidden" class="call-button-inner">
        <div class="call-button-bg"></div>
        <tap class="call-button button flex is-centered" @click.native="toggleCall">
          <span class="icon">
            <span class="icon-telephone"></span>
          </span>
        </tap>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  computed: {
    hidden () {
      const call = this.$store.state.calls.call
      const auth = this.$store.state.auth.auth
      const routeName = this.$route.name

      return (auth === undefined) || (call === undefined) || routeName === 'contact'
    }
  },

  methods: {
    toggleCall () {
      this.$store.dispatch('calls/toggleShow')
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.call-button-outer,
.call-button-inner
  width: $TAB_HEIGHT
  height: $TAB_HEIGHT

.call-button-inner
  position: absolute

.call-button-bg
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 0
  opacity: 0.5
  position: absolute
  background: $gabbi-teal
  box-shadow: 0 0 0 10px $gabbi-teal
  border-radius: $border-radius-lg
  animation-name: button-pulse
  animation-duration: 2s
  animation-iteration-count: infinite

.button.call-button
  top: 0
  left: 0
  color: $gabbi-white
  width: $TAB_HEIGHT
  height: $TAB_HEIGHT
  z-index: 1
  position: absolute
  background: $gabbi-teal
  transition: all $tx-duration-sm $tx-ease
  box-shadow: 0 $shadow-offset-lg $shadow-blur-lg rgba($gabbi-teal, 0.4) !important
  border-color: $gabbi-teal
  border-radius: $border-radius-lg
  &.is-hidden
    opacity: 0
    transform: scale(0)

.icon
  font-size: $icon-size

/* Transitions & Animations */

@keyframes button-pulse
  from
    opacity: 0.65
    transform: scale(0.65)
  to
    opacity: 0
    transform: scale(1.15)

.button-enter-active,
.button-leave-active
  transition: all $tx-duration-sm

.button-enter,
.button-leave-to
  opacity: 0
  transform: scale(0.8)

</style>
