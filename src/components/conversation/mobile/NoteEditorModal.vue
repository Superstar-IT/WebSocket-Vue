<template>
  <div class="note-editor-modal">
    <modal :visible="visible" @close="$emit('close')" :tall="true" class="note-editor-modal" :close-button="false">
      <div class="content flex is-column">
        <h1 v-if="ready" class="title is-5 flex-item">Edit Note</h1>

        <div v-if="ready" class="flex-item field editor">
          <note-editor v-if="note && note.items" class="note-editor" ref="editor" :note="note" />
        </div>

        <div v-if="ready" class="flex-item field">
          <label class="label">I'll remind you...</label>
          <div class="control" @click="editReminder = true">
            <template v-if="note.remind">
              {{ forceDate(note.remind).toLocaleString('en-us', { weekday: 'long', month: 'long', day: 'numeric' }) }}
              <br />
              {{ forceDate(note.remind).toLocaleString('en-us', {  hour: '2-digit', minute: '2-digit' }) }}
            </template>
            <template v-else>
              Don't remind me.
            </template>
            <span class="icon" style="float:right">
              <a class="icon-pencil-line"></a>
            </span>
          </div>
        </div>

      </div>

      <template slot="controls-left">
        <div class="field">
          <p class="control">
            <tap-button @click.native="$emit('close')" class="button is-medium is-outline is-icon" :disabled="saving">
              <span class="icon"><span class="icon-cross"></span></span>
            </tap-button>
          </p>
        </div>
      </template>

      <template slot="controls-right">
        <div class="field">
          <p class="control">
            <tap-button @click.native="save" :class="{ 'button': true, 'is-medium': true, 'is-primary': true, 'is-saving': saving }" :disabled="saving">
              <span class="icon"><span class="icon-check"></span></span>
              <span>Save</span>
            </tap-button>
          </p>
        </div>
      </template>
    </modal>

    <template v-if="ready">
      <edit-reminder-modal :visible="editReminder" :current-date="forceDate(note.remind)" @close="editReminder = false" @save="onSaveReminder" style="z-index:3" />
    </template>
  </div>
</template>

<script>
import grandcentral from '@/api/grandcentral.js'

import Modal from '@/components/mobile/Modal.vue'
import NoteEditor from '@/components/conversation/NoteEditor.vue'
import EditReminderModal from '@/components/conversation/mobile/NoteEditor/EditReminderModal.vue'

export default {
  name: 'NoteEditorModal',

  components: {
    Modal,
    NoteEditor,
    EditReminderModal
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },

    message: {
      type: null,
      default: undefined
    },

    conversationId: {
      type: [ String, undefined ],
      default: undefined
    }
  },

  data () {
    return {
      editReminder: false,

      note: {},
      ready: false,
      saving: false,
      fetchedMessage: undefined
    }
  },

  created () {
    this.setReady(this.message)
  },

  computed: {
    realMessage () {
      return this.fetchedMessage || this.message
    }
  },

  methods: {
    forceDate (strOrDate) {
      if (typeof strOrDate === 'string') {
        return new Date(strOrDate)
      }

      return strOrDate
    },

    onSaveReminder (remind) {
      if (remind) this.$set(this.note, 'remind', remind)
      else this.$delete(this.note, 'remind')
    },

    save () {
      this.saving = true

      const note = {}

      note.items = this.$refs.editor.value.items
      if (this.note.remind) note.remind = this.note.remind.getTime()

      if (note.items.length === 1 && note.items[0].content.text === '') {
        this.$store.dispatch('notifications/show', { type: 'error', message: "Note can't be empty." })
        this.saving = false
        return
      }

      let action

      if (!this.message._id && typeof this.message !== 'string') {
        action = this.$store.dispatch(
          'conversations/addNoteToTimeline',
          { conversationId: this.conversationId, note })
      } else {
        const messageId = typeof this.message === 'string' ? this.message : this.message._id

        if (typeof this.message === 'string') {
          this.$emit('note-updated', note)
        }

        action = this.$store.dispatch(
          'conversations/setMessageNote',
          { conversationId: this.conversationId, messageId, note })
      }

      action
        .then((res) => {
          this.saving = false

          if (!res) return

          this.$emit('saved', {
            note,
            messageId: this.message && this.message._id
          })
        })
        .catch((err) => {
          console.warn(err)
          this.saving = false
        })
    },

    delete () {
      this.$emit('close')
    },

    fetchMessage () {
      this.ready = false

      grandcentral
        .fetchMessage(this.$store.state, this.conversationId, this.message)
        .then((res) => {
          this.fetchedMessage = res
          this.note = res.attributes.note
          delete this.note.remind 

          this.ready = true
        })
        .catch((err) => {
          console.warn(err)
          this.$emit('close')
        })
    },

    setReady (message) {
      if (typeof message === 'string') {
        this.fetchMessage()
      } else if(typeof message === 'object') {
        const attrs = message.attributes
        this.note = (attrs && attrs.note && attrs.note.items)
          ? { ...attrs.note }
          : { items: [{ content: { text: '' }, type: 'text' }] }
        if (this.note.remind) this.note.remind = new Date(this.note.remind)
        this.ready = true
      } else {
        this.ready = false
      }
    }
  },

  watch: {
    message (message) {
      this.setReady(message)
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.note-editor-modal
  z-index: 3

.content
  height: 100%
  position: relative

.editor
  flex: 1
  display: flex
  position: relative

.note-editor
  flex: 1
</style>
