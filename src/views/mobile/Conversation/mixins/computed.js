import AppHeader from '@/components/mobile/AppHeader.vue'
import MessageBar from '@/components/conversation/MessageBar.vue'
import AppFilterBar from '@/components/mobile/AppFilterBar.vue'

import { format, differenceInDays } from 'date-fns'

export default {
  computed: {
    hasNotch () {
      return this.$store.getters.hasNotch
    },

    mobile () {
      return !!this.cordova
    },

    senders () {
      return this.$store.state.conversations.senders
    },

    messages () {
      return this.$store.state.conversations.messages
    },

    conversation () {
      return this.$store.state.conversations.conversation
    },

    agentName () {
      return this.conversation && this.conversation.agent.displayName
    },

    contact () {
      return this.conversation && this.conversation.contact
    },

    error () {
      return this.errors.messages || this.errors.conversation
    },

    ready () {
      return this.messages && this.conversation
    },

    contentShrink () {
      const headerHeight = this.hasNotch ? AppHeader.HEADER_HEIGHT_NOTCH : AppHeader.HEADER_HEIGHT
      const homeIndicatorOffset = this.hasNotch ? 20 : 0

      return headerHeight + MessageBar.MESSAGE_BAR_HEIGHT + AppFilterBar.FILTER_BAR_HEIGHT + homeIndicatorOffset
    },

    messagesList () {
      const messages = []

      let lastDate = -1
      const today = format(new Date(), 'MMddYYYY')

      this.messages.forEach(m => {
        const curDate = format(m.timestamp, 'MMddYYYY')

        if (lastDate !== curDate) {
          let label = ''

          if (differenceInDays(new Date(), m.timestamp) > 7) {
            label = format(m.timestamp, 'MMMM d')
          } else {
            label = curDate === today ? 'Today' : format(m.timestamp, 'EEEE')
          }

          messages.push({
            _id: curDate,
            label
          })
          lastDate = curDate
        }

        messages.push(m)
      })

      const filters = this.filters

      return messages.filter((message) => {
        if (message.label) {
          return true
        }

        if (message.attributes) {
          if (message.attributes.type === 'nudge') {
            return true
          }

          if (message.attributes.type === 'channel-notification') {
            return true
          }

          if (
          message.attributes.type === 'note'
          || message.attributes.note) {
            return filters.notes
          }

          if (
          message.media
          || message.hasUnknownMedia
          ) {
            return filters.mms
          }

          if (
          message.attributes.type === 'inbound-sms'
          || message.attributes.type === 'outbound-sms'
          ) {
            return filters.sms
          }

          if (
          message.attributes.type === 'inbound-email'
          || message.attributes.type === 'outbound-email'
          ) {
            return filters.email
          }

          if (
          message.attributes.type === 'inbound-call'
          || message.attributes.type === 'outbound-call'
          ) {
            return filters.calls
          }
        }

        return true
      }).filter((message, i, arr) => {
        if (message.label) {
          const nextMessage = arr[i + 1]
          return !(nextMessage && nextMessage.label)
        }

        return true
      })
    }
  }
}
