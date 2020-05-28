<template>
  <div :class="{ 'app-view': true, 'conversations-view': true, 'has-notch': hasNotch }">

    <!-- Contact List -->

    <div class="view-inner">

      <!-- Header -->

      <app-header @title="scrollListToTop">
        <template slot="buttons-left">
          <app-header-button icon="menu" @click.native="$emitGlobal('showUserDrawer')" />
        </template>
        <template slot="buttons-right">
          <app-header-button icon="magnifier" @click.native="showSearchModal = true" />
        </template>
        <template slot="title">Conversations</template>
      </app-header>

      <!-- Filter bar -->

      <conversations-filter-bar />

      <!-- Content -->

      <app-content :shrink="contentShrink">

        <!-- Ready -->

        <template v-if="conversationList">

          <!-- List view -->

          <animeta-transition :to="{ scale: 1, opacity: 1 }" :from="{ scale: 0.85, opacity: 0 }" :options="{ easing: 'easeInOutQuad', duration: 150 }">
            <list-view v-if="conversationList.length" :item-height="itemHeight" ref="listView">
              <conversation-list-item
                v-for="(root, i) in conversationList"
                class="list-item"
                :key="root.conversation._id"
                :root="root"
                :index="i"
                :unread="unread(root)"
                @click.native="showConversation(root.conversation._id)"
              />
            </list-view>
          </animeta-transition>

          <!-- Empty -->

          <animeta-transition :to="{ scale: 1, opacity: 1 }" :from="{ scale: 0.85, opacity: 0 }" :options="{ easing: 'easeInOutQuad', duration: 150 }">
            <div v-if="!conversationList.length" class="empty flex is-centered">
              <div class="flex-item">
                <empty-view>
                  <template slot="img">
                    <img src="@/assets/empty-conversations@2x.png" width="90" />
                  </template>
                  No one's talking in here...<br />
                  Why not start a conversation?
                </empty-view>
              </div>
            </div>
          </animeta-transition>

        </template>

        <!-- Error -->

        <div class="error flex is-centered" v-else-if="error">
          <div class="flex-item">
            <error-view />
          </div>
        </div>

        <!-- Loading -->

        <div class="loading flex is-centered" v-else>
          <div class="flex-item"></div>
        </div>

      </app-content>

      <!-- Create conversation -->

      <action-button class="action-button" :disabled="!connected" @tapped="showNewModal = true" @disabled="showOfflineMsg">
        <span class="icon-plus"></span>
      </action-button>

      <contact-search-modal
        title="New Conversation"
        style="z-index:1"
        :visible="showNewModal"
        :create-new="true"
        @close="showNewModal = false"
        @contact="startConversation"
        @new-contact="newContact"
      />

      <!-- Create contact -->

      <modal :visible="showContactModal" :close-button="false" style="z-index:2">
        <div class="content">
          <h1 class="title is-5">Create Contact</h1>
          <contact-form ref="contactForm" :basic="true" @submit="contactSubmit" />
        </div>
        <template slot="controls-left">
          <div class="field">
            <p class="control">
              <tap-button class="button is-medium is-outline is-icon" @click.native="cancelCreateContact" :disabled="creatingContact">
                <span class="icon"><span class="icon-cross"></span></span>
              </tap-button>
            </p>
          </div>
        </template>
        <template slot="controls-right">
          <div class="field">
            <p class="control">
              <tap-button :class="[ 'button', 'is-medium', 'is-primary', creatingContact && 'is-loading' ]" @click.native="createContact" :disabled="!connected || creatingContact">
                <span class="icon"><span class="icon-plus"></span></span>
                <span>Create</span>
              </tap-button>
            </p>
          </div>
        </template>
      </modal>

      <!-- Conversation search -->

      <conversation-search-modal
        :visible="showSearchModal"
        @close="showSearchModal = false"
        @contact="showConversation($event)"
        style="z-index:3"
      />

      <!-- Conversation drawer -->

      <drawer :visible="$route.params.conversationId !== undefined" style="z-index:4">
        <conversation :conversation-id="$route.params.conversationId" @hide="hideConversation" @marked-as-read="markedAsRead" />
      </drawer>

    </div>

  </div>
</template>

<script>
import grandcentral from '@/api/grandcentral.js'
import extractCouchId from '@/helpers/extract-couch-id.js'
import newConversation from '@/helpers/new-conversation.js'
import { hasError, logError } from '@/helpers/api-error-handling.js'

import Modal from '@/components/mobile/Modal.vue'
import Drawer from '@/components/Drawer.vue'
import AppTabs from '@/components/mobile/AppTabs.vue'
import ListItem from '@/components/ListItem.vue'
import ListView from '@/components/ListView.vue'
import EmptyView from '@/components/EmptyView.vue'
import ErrorView from '@/components/ErrorView.vue'
import AppHeader from '@/components/mobile/AppHeader.vue'
import AppContent from '@/components/mobile/AppContent.vue'
import ContactForm from '@/components/contact/ContactForm.vue'
import AppFilterBar from '@/components/mobile/AppFilterBar.vue'
import ActionButton from '@/components/ActionButton.vue'
import Conversation from '@/views/mobile/Conversation/index.vue'
import AppHeaderButton from '@/components/mobile/AppHeaderButton.vue'
import ContactSearchModal from '@/components/contact/mobile/ContactSearchModal.vue'
import ConversationListItem from '@/components/conversation/ListItem.vue'
import ConversationsFilterBar from '@/components/conversation/mobile/ConversationsFilterBar.vue'
import ConversationSearchModal from '@/components/conversation/mobile/ConversationSearchModal.vue'

export default {
  name: 'ConversationsView',

  components: {
    Modal,
    Drawer,
    ListView,
    EmptyView,
    ErrorView,
    AppHeader,
    AppContent,
    ContactForm,
    AppFilterBar,
    ActionButton,
    Conversation,
    AppHeaderButton,
    ContactSearchModal,
    ConversationListItem,
    ConversationsFilterBar,
    ConversationSearchModal
  },

  data () {
    return {
      error: false,
      creatingContact: false,
      showNewModal: false,
      showContactModal: false,
      showSearchModal: false
    }
  },

  computed: {
    hasNotch () {
      return this.$store.getters.hasNotch
    },

    readCounts () {
      return this.$store.state.conversations.readCounts
    },

    connected () {
      return this.$store.state.connected
    },

    itemHeight () {
      return ListItem.LIST_ITEM_HEIGHT
    },

    conversations () {
      return this.$store.state.conversations
    },

    contentShrink () {
      const headerHeight = this.hasNotch ? AppHeader.HEADER_HEIGHT_NOTCH : AppHeader.HEADER_HEIGHT
      const homeIndicatorOffset = this.hasNotch ? 20 : 0

      return AppTabs.TAB_HEIGHT + headerHeight + AppFilterBar.FILTER_BAR_HEIGHT + homeIndicatorOffset
    },

    conversationList () {
      return this.conversations && this.conversations.list
    }
  },

  on: {
    resume () {
      this.fetchConversations()
    },

    reconnect () {
      this.fetchConversations()
    },

    newMessage () {
      this.fetchConversations()
    },

    backButton () {
      if (this.showContactModal) {
        this.showContactModal = false
      } else if (this.showNewModal) {
        this.showNewModal = false
      } else if (this.showSearchModal) {
        this.showSearchModal = false
      }
    }
  },

  created () {
    this.fetchConversations()
  },

  methods: {
    fetchConversations () {
      this.$store
        .dispatch('conversations/fetchList')
        .then(res => {
          if (hasError(res)) {
            logError(this.$store.state, res)
            this.$set(this, 'error', res.error)
            this.$store.dispatch('notifications/show', { type: 'error', message: 'Error fetching conversations.' })
            return
          }

          this.fetchReadCounts()
        })
        .catch(err => {
          logError(this.$store.state, err)
          this.$set(this, 'error', err)
          this.$store.dispatch('notifications/show', { type: 'error', message: 'Error fetching conversations.' })
        })
    },

    // Read counts

    unread (root) {
      if (!this.readCounts) return 0

      const id = extractCouchId(root.conversation._id)
      const readItem = this.readCounts.find(item => item.conversationId === id)
      const messageCount = root.conversation.lastMessage.messageCount

      let readCount
      if (!readItem) readCount = 0 // item doesn't exist so all messages are unread
      else if (readItem.error) readCount = messageCount // an error occurred so pretend like all messages are read
      else readCount = readItem.readCount // actual unread count

      return messageCount - readCount
    },

    markedAsRead () {
      this.fetchConversations()
    },

    fetchReadCounts () {
      this.$store.dispatch('conversations/fetchReadCounts')
    },

    // New contacts

    newContact () {
      this.showContactModal = true
    },

    createContact () {
      this.$refs.contactForm.submit()
    },

    contactSubmit (data) {
      this.creatingContact = true

      grandcentral
        .createContact(this.$store.state, this.$store.state.auth.user.uid, data)
        .then(res => {
          if (hasError(res)) {
            this.creatingContact = false

            if (res.error && res.error.error === 'conflict') {
              // this.showNewConflictModal = true
              this.$store.dispatch('notifications/show', { type: 'error', message: 'A contact with this phone number already exists.' })
            }
            else {
              this.$store.dispatch('notifications/show', { type: 'error', message: 'Error creating contact.' })
              logError(this.$store.state, res)
            }

            return
          }

          history.back()

          this.startConversation(res.id, () => {
            this.creatingContact = false
          }, () => {
            this.creatingContact = false
          })
        })
        .catch(err => {
          this.creatingContact = false
          this.$store.dispatch('notifications/show', { type: 'error', message: 'Error creating contact.' })

          logError(this.$store.state, err)
        })
    },

    cancelCreateContact () {
      this.showContactModal = false
    },

    // New conversations

    startConversation (contactId, onSuccess, onError) {
      this.startingConversation = true

      const success = (conversation) => {
        this.startingConversation = false
        this.$router.replace({ path: `/conversations/${conversation._id}` })
        this.fetchConversations() // update list with newly added conversation

        if (onSuccess) onSuccess(conversation)
      }

      const error = (message) => {
        this.startingConversation = false
        this.$store.dispatch('notifications/show', { type: 'error', message })

        if (onError) onError(message)
      }

      newConversation.call(this, contactId, success, error)
    },

    // Utilities, routing and event handlers

    scrollListToTop () {
      this.$refs.listView.scrollToTop()
    },

    hideConversation () {
      this.$router.back()
    },

    showConversation (conversationId) {
      if (this.$route.meta.screen === 'search-conversations') {
        this.$router.replace({ path: `/conversations` })
      }
      this.$router.push({ path: `/conversations/${conversationId}` })
    },

    showOfflineMsg () {
      this.$store.dispatch('notifications/show', { type: 'error', message: 'No network connection. Please try again later.' })
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/mixins.sass"
@import "@/styles/variables.sass"

.view-inner
  top: 0
  left: 0
  width: 100%
  height: 100%
  position: absolute
  background: $gabbi-grey-2

.list-item
  width: 100vw
  overflow-x: hidden

.action-button
  right: $margin-lg
  bottom: calc(#{$margin-lg} + #{$TAB_HEIGHT})
  position: absolute

.has-notch
  .action-button
    bottom: calc(#{$margin-lg} + #{$TAB_HEIGHT_NOTCH})

.empty,
.error,
.loading
  height: 100%

.loading
  .flex-item
    width: 70px
    height: 70px
    +loader
</style>
