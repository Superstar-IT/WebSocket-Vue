<template>
  <div class="message-card-task flex is-row">
    <div class="flex-item message-card-task-check">
      <input-checkbox :checked="isChecked" @change="$emit('change', $event), isChecked = $event.target.checked" />
    </div>
    <div class="flex-item message-card-task-inner checked">
      <div :class="[ 'message-content', isChecked && 'is-checked' ]">
        Send paperwork to James Kent's mortgage broker.
      </div>
      <div class="message-card-task-footer flex is-row">
        <div class="flex-item">
          <small class="is-soft">Firstname Lastname</small>
        </div>
        <div :class="[ 'timestamp-outer', 'is-soft', 'flex-item', 'is-aligned-right', !isChecked && urgent && 'is-urgent', 'flex', 'is-row' ]">
          <span class="icon">
            <span class="icon-clock3"></span>
          </span>
          <small class="timestamp">XX:XX XX</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputCheckbox from '@/components/form/InputCheckbox.vue'

export default {
  name: 'MessageCardTask',

  components: {
    InputCheckbox
  },

  data () {
    return {
      isChecked: this.checked
    }
  },

  props: {
    urgent: {
      type: Boolean,
      default: false
    },
    checked: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/mixins.sass"
@import "@/styles/variables.sass"

.message-card-task
  margin-left: -($margin - $margin-sm)

.message-card-task-check
  padding-right: $margin-sm

.message-card-task-footer
  margin-top: $margin-sm

.message-content
  font-size: 15px
  transition: color $tx-duration-sm $tx-ease
  &.is-checked
    color: $gabbi-grey-0

.is-urgent
  color: $danger !important

.timestamp-outer
  transition: color $tx-duration-sm $tx-ease

.timestamp
  height: 24px
  line-height: 24px
  margin-left: $margin-sm
</style>
