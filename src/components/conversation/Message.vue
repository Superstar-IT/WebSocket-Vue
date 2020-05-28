<template>
  <div :class="{ 'message': true, [`is-${type}`]: true, 'has-media': message.media, 'has-note': note !== undefined, 'is-lonely': isLonely }">

    <!-- Media -->

    <div class="message-media" v-if="message.media || message.hasUnknownMedia">
      <image-message
        v-for="(media, i) in images"
        class="image-message"
        ref="images"
        :key="media.url + i"
        :right="type !== 'contact'"
        :media="media"
        :sender="sender"
        :timestamp="timestamp"
        :show-body="!message.body && i === images.length-1"
        @click.native="$emit('expand-media', media)"
      />
      <div v-if="message.hasUnknownMedia" :class="{ 'unknown-media': true, 'has-no-body': !message.body }">
        <span>This message contains unsupported media.</span>
      </div>
    </div>

    <!-- Contents -->

    <div class="message-inner" v-if="message.body">

      <div class="message-content">
        <slot>{{ message.body }}</slot>
      </div>

      <footer v-if="type !== 'action' || $slots.footer || $slots.footerRight" :class="`message-footer is-${type} flex is-row`">
        <div class="flex-item">
          <small>
            <slot name="footer">{{ sender }}</slot>
          </small>
        </div>
        <div class="flex-item is-aligned-right">
          <small class="timestamp">
            <slot name="footer-right">{{ timestamp }}</slot>
          </small>
        </div>
      </footer>

      <tap v-if="hasContextMenu" class="context-menu" @click.native="$emit('context-menu')">
        <span class="icon">
          <span class="icon-ellipsis"></span>
        </span>
      </tap>

    </div>

    <!-- Note -->

    <div class="message-note" v-if="note">
      <note :note="note" :message="message" :message-id="message._id" :conversation-id="conversationId" class="message-note-inner" />
    </div>

    <!-- Actions -->

    <div v-if="type === 'action'" class="message-actions">
      <slot name="actions" />
    </div>

  </div>
</template>

<script>
import message from '@/mixins/message.js'

import Note from '@/components/conversation/Note.vue'
import ImageMessage from '@/components/conversation/ImageMessage.vue'

export default {
  name: 'Message',

  mixins: [
    message
  ],

  components: {
    Note,
    ImageMessage
  },

  props: {
    type: {
      type: String,
      default: 'contact' // contact, action, agent, gabbi
    },

    hasContextMenu: {
      type: Boolean,
      default: true
    },

    isLonely: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    note () {
      if(this.message.attributes.note)
        return this.message.attributes.note
    },

    files () {
      return this.message.media && this.message.media.filter((m) => m.type === 'file')
    },

    images () {
      return this.message.media && this.message.media.filter((m) => m.type === 'image')
    }
  },

  methods: {
    checkMedia () {
      if (!this.$refs.images) return

      this.$refs.images.forEach((child) => {
        child.checkIfInViewport()
      })
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.message
  max-width: 100%
  display: inline-block
  &.has-note
    .message-inner
      width: 100%
  &.is-lonely
    width: 100%
    display: block
    padding: 0 !important
    .message-inner
      width: 100%
      display: block
  &.is-contact
    padding-right: $margin
    text-align: left
  &:not(.is-contact)
    padding-left: $margin
    text-align: right

.message-inner
  max-width: 100%
  display: inline-block
  padding: 1rem
  position: relative
  text-align: left

.message
  position: relative
  &.has-note
    .message-inner
      border-bottom-left-radius: 0 !important
      border-bottom-right-radius: 0 !important
  &.is-right
    .message-media
        margin-left: auto
  &.has-media
    width: 100%
  &.is-contact
    .message-inner
      background: $gabbi-white
      border: solid 1px $gabbi-grey-2
      border-left: none
      border-radius: 0 $border-radius $border-radius 0
    .unknown-media
      &:first-child
        border-radius: 0 $border-radius 0 0
      &.has-no-body
        border-radius: 0 $border-radius $border-radius 0
  &:not(.is-contact):not(.is-action)
    margin-left: auto
    .unknown-media
      &:first-child
        border-radius: $border-radius 0 0 0
      &.has-no-body
        border-radius: $border-radius 0 0 $border-radius
    .message-inner
      color: $gabbi-white
      border-radius: $border-radius 0 0 $border-radius
    &.is-agent
      .message-inner
        background: $gabbi-teal
      .context-menu
        color: $gabbi-white
        background-color: $gabbi-teal
    &.is-gabbi
      .message-inner
        background: $gabbi-navy
      .context-menu
        color: $gabbi-white
        background-color: $gabbi-navy
  &.is-action
    strong
      color: $gabbi-pink
    .message-inner
      color: $gabbi-pink
      background: rgba($gabbi-pink, 0.2)
      border-radius: $border-radius 0 0 0
    &.is-lonely
      .message-inner
        border-radius: $border-radius $border-radius 0 0

.message-content
  font-size: 15px
  padding-right: 1.5rem
  user-select: text !important

.message-actions
  margin-top: 2px

.timestamp
  display: inline-block
  margin-left: 1rem

.context-menu
  top: 0.5rem
  right: 0.5rem
  z-index: 1
  cursor: pointer
  position: absolute
  background: white
  padding: 0.25rem
  color: $gabbi-grey-0
  // opacity: 0
  // pointer-events: none
  border-radius: $border-radius-sm
  transition: $tx-duration ease-in-out

// .message:hover
//   .context-menu
//     opacity: 1
//     pointer-events: all

.message-footer
  margin-top: $margin-sm
  &.is-contact
    color: $gabbi-grey-0
  &.is-agent,
  &.is-gabbi,
  &.is-action
    opacity: 0.6

.message-media
  max-width: 500px
  + .message-inner
    width: 100%
    max-width: 500px
    // border-top: none !important
    border-top-left-radius: 0 !important
    border-top-right-radius: 0 !important

.image-message:not(.show-body)
  margin-bottom: 2px

.unknown-media
  color: $gabbi-grey-0
  padding: $margin
  font-size: $font-size-sm
  background: $gabbi-grey-2
  margin-bottom: 2px
  &.has-no-body
    display: inline-block
    margin-bottom: 0 !important

.message.is-right
  .message-note-inner
    border-bottom-left-radius: $border-radius

.message:not(.is-right)
  .message-note-inner
    border-bottom-right-radius: $border-radius
</style>
