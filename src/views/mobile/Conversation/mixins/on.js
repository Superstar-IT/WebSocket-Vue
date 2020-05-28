import extractCouchId from '@/helpers/extract-couch-id.js'

export default {
  on: {
    resume () {
      this.fetchMessages()
    },

    disconnect () {
      this.offline = true
    },

    reconnect () {
      this.offline = false
      this.fetchMessages()
    },

    newMessage (evt) {
      const id = extractCouchId(this.conversationId)
      const { conversationId } = evt.detail

      if (conversationId !== id) return

      this.fetchMessages()
    },

    callStatusChanged (evt) {
      const id = extractCouchId(this.conversationId)
      const { conversationId } = evt.detail

      if (conversationId !== id) return

      this.fetchMessages()
    },

    backButton () {
      if (this.showContact) {
        // do nothing
      }

      else if (this.editAddNote !== undefined) {
        this.editAddNote = undefined
      }

      else if (this.sendMedia !== undefined) {
        this.sendMedia = undefined
      }

      else if (this.messageActionsMessage !== undefined) {
        this.messageActionsMessage = undefined
      }

      else if (this.showMessageBarActions) {
        this.showMessageBarActions = false
      }

      else {
        this.hideConversation()
      }
    }
  }
}
