import filters from '@/helpers/filters.js'
import constants from '@/constants.js'
import grandcentral from '@/api/grandcentral.js'

export default {
  methods: {
    updateNudges ({ messageId }) {
      const nudge = this.$store.state.conversations.messages.find((m) => {
        if (m.extra && m.extra.message && m.extra.message._id === messageId) {
          return true
        }
        return false
      })

      if (nudge) {
        this.fetchMessages()
      }
    },

    itemChecked ({ evt, i }, message) {
      const note = message.attributes.note

      note.items[i].content.checked = evt.target.checked

      const otherMsg = this.$store.state.conversations.messages.find((m) => m._id === message._id)
      if (otherMsg) {
        this.$set(otherMsg.attributes, 'note', note)
      }
    },

    noteUpdated (note) {
      const msg = this.messages.find((m) => m._id === this.editAddParent)
      if (!msg) return

      this.$set(msg.extra.message.attributes, 'note', note)
    },

    noteSaved ({ messageId }) {
      this.editAddNote = undefined

      if (!messageId) return  this.scrollListToBottom()

      const { messages } = this.$store.state.conversations

      const index = messages.findIndex((m) => m._id === messageId)

      if (index === messages.length - 1) this.scrollListToBottom()
    },

    addHintToMessage (message) {
      this.editAddNote = message
      this.messageActionsMessage = undefined
    },

    addHintToTimeline () {
      this.editAddNote = {}
      this.showMessageBarActions = false
    },

    showMessageActions (message) {
      this.messageActionsMessage = message
    },

    showEmail (message) {
      this.messageActionsMessage = undefined

      const emailId = message.attributes.email.id
      const idToken = this.$store.state.auth.auth.idToken
      const spaceId = this.$store.state.config.spaceId
      const conversationId = this.conversationId

      const url = constants.apis.grandcentral.url
       + `/space/${spaceId}/app/marshall/conversations/${conversationId}/emails/${emailId}/html`
       + `?token=${idToken}`

      window.open(url, '_blank')
    },

    listViewMounted () {
      this.checkMessageMedia()
    },

    listViewUpdated () {
      this.checkMessageMedia()
    },

    checkMessageMedia () {
      this.$refs.listView.$children
        .filter(child => child.checkMedia !== undefined)
        .forEach(child => {
          child.checkMedia()
        })
    },

    fetchConversation () {
      const { conversationId } = this

      this.$store
        .dispatch('conversations/fetchConversation', conversationId)
        .then((res) => {
          if (res.error) {
            this.$store.dispatch('notifications/show', { type: 'error', message: res.error })
            this.$set(this.errors, 'conversation', res)
            return
          }
        })
        .catch((err) => {
          this.$store.dispatch('notifications/show', { type: 'error', message: 'Error fetching conversation.' })
          this.$set(this.errors, 'conversation', err)
        })
    },

    fetchMessages (fast) {
      const { conversationId } = this

      this.markAsRead()

      this.$store
        .dispatch('conversations/fetchMessages', conversationId)
        .then((res) => {
          if (res.error) {
            this.$store.dispatch('notifications/show', { type: 'error', message: res.error })
            this.$set(this.errors, 'messages', res)
            return
          }

          this.$nextTick(() => {
            this.scrollListToBottom(fast)
          })
        })
        .catch((err) => {
          this.$store.dispatch('notifications/show', { type: 'error', message: 'Error fetching conversation.' })
          this.$set(this.errors, 'messages', err)
        })
    },

    markAsRead () {
      const { conversationId } = this

      this.$emit('marked-as-read')

      this.$store
        .dispatch('conversations/markAsRead', conversationId)
        .then(res => {
          if (res.error) {
            return
          }
        })
    },

    sendMessage (message, mediaUrl, mediaType) {
      if (this.offline || this.sendingMessage) return

      this.sendingMessage = true

      const { conversationId } = this

      this.$store
        .dispatch('conversations/sendMessage', { conversationId, message, mediaUrl, mediaType })
        .then((res) => {
          this.sendingMessage = false

          if (res.error) {
            this.$store.dispatch('notifications/show', { type: 'error', message: 'Error sending message.' })
            return
          }

          this.$refs.messageBar.reset()
          this.markAsRead()
          this.scrollListToBottom()
        })
        .catch(() => {
          this.sendingMessage = false
          this.$store.dispatch('notifications/show', { type: 'error', message: 'Error sending message.' })
        })
    },

    startCall () {
      this.$store.dispatch('calls/start', {
        id: this.conversationId,
        displayName: filters.displayName(this.contact)
      })
    },

    hideConversation () {
      this.$emit('hide')
    },

    // Voice messages

    hideVoiceCalls (caller) {
      this.$refs.listView.$children.forEach(child => {
        child.$children && child.$children.forEach(c => {
          if (c !== caller && c.hideCall) c.hideCall()
        })
      })
    },

    // Scroll handling and utilities

    listViewScrolled () {
      this.scrolledToBottom = this.$refs.listView.scrolledToBottom

      this.checkMessageMedia()
    },

    scrollListToBottom (fast) {
      if (!this.$refs.listView) return

      this.$nextTick(() => {
        this.$refs.listView.scrollToBottom(fast)
      })
    },

    scrollListToTop () {
      this.$refs.listView.scrollToTop()
    },

    listViewResized () {
      const { listView, messageBar } = this.$refs

      const input = messageBar.$el.querySelector('input')

      if (input && document.activeElement === input) {
        listView.scrollToBottom()
      }
    },

    // Contact crud

    contactUpdated (contact) {
      this.$router.back()
      this.$store.dispatch('conversations/updateConversationContact', contact)
      this.$store.dispatch('conversations/fetchSenders')
    },

    contactRemoved () {
      this.$router.replace({ path: '/conversations' })
      this.$store.dispatch('conversations/removeListItem', this.conversationId)
    },

    // Email

    emailSender (sender) {
      return sender + ' via Email'
    },

    // MMS

    srcToFile (src) {
      const id = Math.round(Math.random() * Date.now())
      return (fetch(src)
        .then((res) => res.arrayBuffer())
        .then((buf) => new File([ buf ], `image${id}.jpg`, { type: 'image/jpeg' }))
      )
    },

    openCamera (source) {
      if (!this.cordova) return

      const { Camera } = this

      const success = (data) => {
        console.log('data', data)
        this.srcToFile('data:image/jpeg;base64,' + data).then(file => {
          this.startFileUpload([ file ])
        })
      }

      const error = (err) => {
        console.warn(err)
      }

      const sourceType = source === 'camera'
        ? Camera.PictureSourceType.CAMERA
        : Camera.PictureSourceType.PHOTOLIBRARY

      const options = {
        quality: 49,
        mediaType: Camera.MediaType.PICTURE,
        sourceType,
        encodingType: Camera.EncodingType.JPEG,
        destinationType: Camera.DestinationType.DATA_URL
      }

      navigator.camera.getPicture(success, error, options)
    },

    startFileUpload (files) {
      this.showMessageBarActions = false

      const file = files[0]
      console.log('file', file)

      const reader = new FileReader()
      reader.addEventListener('load', () => {
        const mediaUrl = reader.result
        const mimeType = file.type

        this.$set(this, 'sendMediaFiles', (message) => {
          grandcentral
            .uploadImages(this.$store.state, files)
            .then((res) => {
              if (res.length && res[0].s3 && res[0].s3.medium) {
                const url = res[0].s3.medium

                this.sendMessage(message, url, mimeType)
                this.sendMedia = undefined
              } else {
                console.warn('error')
              }
            })
            .catch((err) => {
              console.warn(err)
            })
        })

        this.$set(this, 'sendMedia', { mediaUrl, mimeType })
      })
      reader.readAsDataURL(file)
    },

    sendMediaMessage ({ message }) {
      this.sendMediaFiles(message)
    },

    dismissReminder (message) {
      this.$set(message.attributes.notification, 'dismissed', true)

      grandcentral
        .dismissNudge(this.$store.state, this.conversationId, message._id)
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.warn(err)
        })
    }
  }
}
