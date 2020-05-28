<template>
  <list-item class="conversation-list-item" :small="true" :index="index">

    <!-- Avatar -->

    <template slot="avatar">
      <avatar v-if="contact.avatar" :small="true" />
      <letter-crest v-else :seed="contact._id" :small="true" :display-name="contact | displayName" />
    </template>

    <!-- Top row -->

    <template slot="top-row">
      <div class="flex is-row is-wide is-spaced-sm">

        <!-- Name/number/email -->

        <div class="flex is-row flex-item" style="flex-shrink:0">
          <small v-if="contact.first || contact.last" class="flex-item">{{ contact | displayName }}</small>
          <small v-else>{{ contact.primaryPhone | phoneNumber }}</small>
        </div>

        <!-- Status -->

        <div class="flex is-row is-spaced status">
          <small class="flex-item is-soft" style="white-space:nowrap">{{ timestamp }}</small>
          <transition name="pop">
            <!-- <span v-if="unread" class="flex-item tag is-rounded is-unread">{{ unread }}</span> -->
          </transition>
        </div>

      </div>
    </template>

    <!-- Bottom row -->

    <template slot="bottom-row">
      <div class="flex is-row is-wide" v-if="contact.primaryPhone || contact.email">

        <!-- Last message -->

        <div class="flex is-row flex-item" style="flex-shrink:0">
          <small class="flex-item is-soft no-wrap message-preview">{{ conversation.lastMessage.body }}</small>
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
  name: 'ContactSmallListItem',

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
    }
  },

  computed: {
    timestamp () {
      return filters.timeAgoVerbose(this.conversation.lastMessage.timestamp, Date.now())
    },

    contact () {
      return this.root.contact
    },

    conversation () {
      return this.root.conversation
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.conversation-list-item
  background-color: $gabbi-grey-3

.tag:not(body)
  height: 1rem
  padding: 0 0.5rem
  font-size: 11px
  &.is-conversation
    color: $gabbi-grey-0
    border: solid 1px $gabbi-grey-1
    background: transparent
    text-transform: uppercase
    letter-spacing: 1px

.message-preview
  max-width: 250px

.status
  top: -2px
  right: 0
  position: absolute
</style>
