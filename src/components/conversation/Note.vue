<template>
  <div class="note">
    <note-body @item-checked="itemChecked" :message="message" />
    <div v-if="note.remind" class="note-reminder">
      <span class="icon-clock"></span>
      {{ note.remind | timeRelative }}
    </div>
  </div>
</template>

<script>
import NoteBody from '@/components/conversation/NoteBody.vue'

export default {
  name: 'Note',

  components: {
    NoteBody
  },

  props: {
    message: {
      type: null,
      required: true
    },

    messageId: {
      type: String,
      required: true
    },

    conversationId: {
      type: String,
      required: true
    }
  },

  computed: {
    note () {
      if(this.message)
        if(this.message.attributes.note)
          return this.message.attributes.note
    }
  },

  methods: {
    itemChecked ({ evt, i }) {
      const note = {
        items: [ ...this.note.items ]
      }
      note.items[i].content.checked = evt.target.checked

      this.$store
        .dispatch('conversations/setMessageNote', {
          conversationId: this.conversationId,
          messageId: this.messageId, note
        })
        .then(() => {
          this.$emit('note-updated', { messageId: this.messageId, note })
        })
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

$dark-teal: darken($gabbi-teal, 10)

.note
  color: $dark-teal
  padding: 1rem
  font-size: 15px
  margin-top: 2px
  text-align: left
  background-color: #E9F4F3

.note-reminder
  display: flex
  align-items: center
  margin-top: 0.5rem
  justify-content: flex-end
  font-size: $font-size-sm
  .icon-clock
    display: inline-flex
    margin-right: 0.5rem
</style>
