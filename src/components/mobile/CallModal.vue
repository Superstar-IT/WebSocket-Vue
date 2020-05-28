<template>
  <div class="modal-outer">
    <transition name="modal">
      <div v-if="show" class="call-modal modal is-active">
        <tap class="modal-background" @click.native="hideCall"></tap>
        <div class="modal-content">
          <div class="call-header box flex is-column">
            <template v-if="call">
              <p class="flex-item">
                <template v-if="call.status === 'connecting'">Connecting to...<br /></template>
                <template v-if="call.status === 'in-progress'">Connected to...<br /></template>
                <span class="title is-4">{{ call.displayName }}</span>
              </p>
              <br />
              <template v-if="call.status === 'connecting'">
                <p class="flex-item">
                  Please wait for a call on your phone to be connected.
                </p>
                <br />
              </template>
              <p class="flex-item">
                <tap-link class="link mr-10" @click.native="hideCall">Hide Call</tap-link>
              </p>
              <p class="flex-item">
                <tap-link class="link" @click.native="endCall">Hang Up</tap-link>
              </p>
            </template>
            <template v-else>
              <div class="content">
                <p>
                  No call in progress.
                </p>
                <p>
                  <tap-link class="link" @click.native="hideCall">Hide</tap-link>
                </p>
              </div>
            </template>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'CallModal',

  computed: {
    call () {
      return this.$store.state.calls.call
    },

    show () {
      return this.$store.state.calls.showCall
    }
  },

  methods: {
    hideCall () {
      this.$store.dispatch('calls/toggleShow')
    },
    endCall() {
      this.$store.dispatch('calls/end')
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.call-modal

.modal-background
  opacity: 0.85
  background: $gabbi-grey-2
  pointer-events: all

.modal-content
  overflow: visible

.box
  padding: $margin-x-lg
  text-align: center
  box-shadow: 0 $shadow-offset-lg $shadow-blur-lg $shadow-grey
  border-radius: $border-radius-lg

.title
  font-weight: lighter

.call-header
  color: $gabbi-navy

/* Transitions */

.modal-enter-active,
.modal-leave-active
  transition: all $tx-duration
  .modal-background
    transition: all $tx-duration $tx-ease
  .modal-content
    transition: all $tx-duration $tx-ease

.modal-enter,
.modal-leave-to
  .modal-background
    opacity: 0
  .modal-content
    opacity: 0
    transform: scale(0.8)

</style>
