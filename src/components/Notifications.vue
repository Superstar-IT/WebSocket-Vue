<template>
  <div class="notifications">
    <transition-group name="pop">
      <tap
        v-for="n in notifications"
        class="notification flex is-row"
        :key="n.id"
        @click.native="$store.dispatch('notifications/hide')"
      >
        <div class="flex is-row is-centered">
          <div :class="`flex-item notification-type flex is-column is-centered is-${n.type}`">
            <span class="icon">
              <span :class="`icon-${icon(n.type)}`"></span>
            </span>
          </div>
          <div class="flex-item notification-message">{{ n.message }}</div>
        </div>
      </tap>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'Notifications',

  computed: {
    notifications () {
      return [ ...this.$store.state.notifications.notifications ].reverse()
    }
  },

  methods: {
    icon (type) {
      switch (type) {
        case 'info': return 'bubble'
        case 'error': return 'warning'
        case 'success': return 'check'
        default: return 'rocket'
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/mixins.sass"
@import "@/styles/variables.sass"

.notifications
  width: 100%
  height: 100%
  position: relative

.notification
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 0
  position: absolute
  background: $gabbi-white
  transition: all $tx-duration
  box-shadow: 0 0 1px 1px $shadow-grey, 0 -$shadow-offset-lg $shadow-blur-lg $shadow-grey
  overflow: hidden
  &:last-child
    margin-top: 0rem
    pointer-events: auto

.notification-type
  width: 50px
  height: 70px
  color: $gabbi-white
  background: $gabbi-pink
  .icon
    font-size: $icon-size
    text-align: center
    transform: translate(1px, -1px)
  &.is-info
    background: $gabbi-navy
  &.is-error
    background: $danger
  &.is-success
    background: $gabbi-teal

.notification-message
  padding: 1rem

.pop-enter-active,
.pop-leave-active
  transition: all $tx-duration

.pop-enter
  opacity: 0
  transform: translateY(3rem)

.pop-leave-to
  opacity: 0
  transform: translateY(3rem)

</style>
