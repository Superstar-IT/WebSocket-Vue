import filters from '@/helpers/filters.js'

export default {
  props: {
    message: {
      type: Object
    },

    senders: {
      type: [ Array, undefined ],
      default: undefined
    },

    senderFn: {
      type: [ Function, undefined ],
      default: undefined
    },

    conversationId: {
      type: String
    }
  },

  data () {
    return {
      now: Date.now(),
      nowInterval: 1000 * 60 // update every 60 seconds
    }
  },

  computed: {
    timestamp () {
      return filters.timeAgo(this.message.timestamp, this.now)
    },

    sender () {
      const { senders, message, senderFn } = this

      let finalSender = ''

      let sender = false
      if (senders) sender = senders.find(s => s.messageId === message._id)

      if (sender && (sender.contact || sender.agent)) {
        if (sender.contact) {
          finalSender = filters.displayName(sender.contact)
        }
        else {
          finalSender = sender.agent.displayName
        }
      }
      else {
        if (message.attributes.origin === 'external') {
          finalSender = filters.displayName(message.attributes.sender)
        }
        else if (message.attributes.origin === 'truUser') {
          finalSender = message.attributes.sender.displayName
        }
        else {
          finalSender = 'Gabbi.ai'
        }
      }

      return senderFn ? senderFn(finalSender) : finalSender
    }
  },

  created () {
    this.nowInterval = setInterval(() => {
      this.now = Date.now()
    }, this.nowInterval)
  },

  destroyed () {
    clearInterval(this.nowInterval)
  }
}
