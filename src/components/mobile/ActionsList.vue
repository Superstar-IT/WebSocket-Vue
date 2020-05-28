<template>
  <div class="actions-list">
    <div class="modal is-active">

      <animeta-transition :to="{ opacity: 0.85 }" :from="{ opacity: 0 }" :options="{ duration: 150, easing: 'linear' }">
        <div v-if="visible" class="modal-background"></div>
      </animeta-transition>

      <animeta-transition :to="{ translateY: '0%' }" :from="{ translateY: '100%' }" :options="{ duration: 600, elasticity: 0 }">
        <div v-if="visible" class="modal-content">
          <div class="modal-content-inner flex is-column">
            <div class="modal-slot">
              <div class="modal-slot-inner">
                <div class="modal-list">
                  <slot />
                </div>
                <actions-list-button class="is-cancel" @click.native="$emit('close-actions')" />
              </div>
            </div>
          </div>
        </div>
      </animeta-transition>

    </div>
  </div>
</template>

<script>
import ActionsListButton from '@/components/mobile/ActionsListButton.vue'

export default {
  name: 'ActionsList',

  components: {
    ActionsListButton
  },

  props: {
    visible: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.actions-list
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 1
  position: absolute
  pointer-events: none

.modal
  align-items: flex-end

.modal-background
  opacity: 0.85
  background: $gabbi-grey-2
  pointer-events: all

.modal-content
  margin: 0 $margin
  padding: 0
  position: relative
  overflow: visible
  transform: translate3d(0, 0%, 0)
  max-height: calc(100vh - 20px)
  pointer-events: auto

.modal-content-inner
  width: 100%
  height: 100%
  position: relative

.modal-slot
  flex: 1
  width: 100%
  height: 100%

.modal-slot-inner
  width: 100%

.modal-list
  box-shadow: 0 $shadow-offset-lg $shadow-blur-lg $shadow-grey
  border-radius: $border-radius-lg
  margin-bottom: $margin

.actions-list-button.is-cancel
  display: block
  box-shadow: 0 40px 0 $gabbi-white, 0 $shadow-offset-lg $shadow-blur-lg $shadow-grey
  font-weight: bold
  border-radius: $border-radius-lg $border-radius-lg 0 0
  justify-content: center !important
</style>
