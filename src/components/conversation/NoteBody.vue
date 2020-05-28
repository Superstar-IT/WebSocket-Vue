<template>
  <div :class="{ 'note-body': true, 'is-read-only': readOnly }">
    <div v-for="(item, i) in note.items" :class="`note-item is-${item.type}`" :key="item.type + i">
      <template v-if="item.type === 'text'">
        {{ item.content.text }}
      </template>
      <template v-else-if="item.type === 'checkbox'">
        <div>
          <label class="flex is-row checkbox-label">
            <span class="flex-item checkbox-checkbox">
              <input-checkbox
                :type="(readOnly || primary) ? 'primary' : 'secondary'"
                v-model="item.content.checked"
                :slim="true"
                :checked="item.content.checked"
                @change="onChange($event, i)"
              />
            </span>
            <span :class="{ 'flex-item': true, 'checkbox-text': true, 'is-checked': item.content.checked }">
              <span>{{ item.content.text }}</span>
            </span>
          </label>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import InputCheckbox from '@/components/form/InputCheckbox.vue'

export default {
  name: 'NoteBody',

  components: {
    InputCheckbox
  },

  props: {
    message: {
      type: null,
      required: true
    },

    readOnly: {
      type: Boolean,
      default: false
    },

    primary: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    note () {
      return this.message.attributes.note
    }
  },

  methods: {
    onChange (evt, i) {
      if (this.readOnly) {
        evt.preventDefault()
        return
      }

      this.$emit('item-checked', { evt, i })
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.note-body
  &.is-read-only
    label
      pointer-events: none

.note-item
  margin: 0.75rem 0
  &.is-checkbox
    margin: 0.3rem 0
  &:first-child
    margin-top: 0
  &:last-child
    margin-bottom: 0

.checkbox-label
  color: inherit

.checkbox-checkbox
  font-size: 0
  margin-right: $margin

.checkbox-text
  display: inline-block
  position: relative
  span
    transition: all $tx-duration
  &::after
    top: 50%
    left: 0
    right: 0
    height: 1px
    content: ''
    display: block
    position: absolute
    box-shadow: 0 0 0 100px inset
    transform: scale(0)
    transition: all $tx-duration
    transform-origin: 0 50%
    overflow: hidden
  &.is-checked
    span
      opacity: 0.6
    &::after
      transform: scale(1)
</style>
