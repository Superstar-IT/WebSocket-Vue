<template>
  <list-item :class="[ 'conversation-list-item', (unread && 'is-unread') ]" :index="index">

    <!-- Avatar -->

    <template slot="avatar">
      <avatar v-if="contact.avatar" />
      <letter-crest v-else :seed="contact._id" :display-name="contact | displayName" />
    </template>

    <!-- Top row -->

    <template slot="top-row">
      <div class="flex is-row is-wide is-spaced-sm">

        <!-- Name/number/email -->

        <div class="flex is-row flex-item" style="flex-shrink:0">
          <span v-if="contact.first || contact.last" class="flex-item">{{ contact | displayName }}</span>
          <span v-else>{{ contact.primaryPhone | phoneNumber }}</span>
        </div>

        <!-- Tags -->

        <div v-if="!filtered" class="flex is-row flex-item">
          <span v-if="contact.buyer && contact.seller" class="flex-item tag is-rounded is-contact">Buy/Sell</span>
          <span v-else-if="contact.buyer" class="flex-item tag is-rounded is-contact">Buyer</span>
          <span v-else-if="contact.seller" class="flex-item tag is-rounded is-contact">Seller</span>
        </div>

        <!-- Status -->

        <div class="flex is-row is-spaced status">
          <small class="flex-item is-soft" style="white-space:nowrap">{{ timestamp }}</small>
          <transition name="pop">
            <span v-if="unread" class="flex-item tag is-rounded is-unread">{{ unread }}</span>
          </transition>
        </div>
      </div>
    </template>

    <!-- Bottom row -->

    <template slot="bottom-row">
      <div class="flex is-row is-wide">

        <!-- Last message -->

        <div class="flex is-row flex-item" style="flex-shrink:0">
          <small class="flex-item is-soft no-wrap message-preview">{{ conversation.lastMessage.body }}</small>
        </div>

        <!-- Status icons -->

        <div class="flex is-row flex-item is-aligned-right" style="flex-shrink:0">
          <!-- <span class="flex-item icon">&times;</span>
          <span class="flex-item icon">&times;</span>
          <span class="flex-item icon">&times;</span> -->
        </div>

      </div>
    </template>

  </list-item>
</template>

<script>
import filters from '@/helpers/filters.js'

import Avatar from '@/components/Avatar.vue'
import ListItem from '@/components/ListItem.vue'
import listItem from '@/mixins/list-item.js'
import LetterCrest from '@/components/LetterCrest.vue'

export default {
  name: 'ConversationListItem',

  mixins: [ listItem ],

  components: {
    Avatar,
    ListItem,
    LetterCrest
  },

  props: {
    root: {
      type: Object,
      required: true
    },

    unread: {
      type: [ Number, undefined ],
      default: undefined
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
      return filters.timeAgoVerbose(this.conversation.lastMessage.timestamp, this.now)
    },

    contact () {
      return this.root.contact
    },

    conversation () {
      return this.root.conversation
    },

    filtered () {
      const { listFilters } = this.$store.state.conversations
      return listFilters.buyer || listFilters.seller
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
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.conversation-list-item
  transition: background-color $tx-duration $tx-ease, transform $tx-duration-sm $tx-ease
  background-color: $gabbi-grey-3
  &.is-unread
    background-color: $gabbi-white

.tag:not(body)
  height: 1rem
  padding: 0 0.5rem
  font-size: 11px
  &.is-contact
    color: $gabbi-grey-0
    border: solid 1px $gabbi-grey-1
    background: transparent
    text-transform: uppercase
    letter-spacing: 1px
  &.is-unread
    color: $gabbi-white
    font-weight: bold
    background-color: $gabbi-teal

.message-preview
  max-width: 200px

.status
  top: 0
  right: 0
  position: absolute

/* Transitions */

.pop-enter-active,
.pop-leave-active
  transition: all $tx-duration-sm $tx-ease

.pop-enter,
.pop-leave-to
  opacity: 0
  transform: scale(0)
</style>
