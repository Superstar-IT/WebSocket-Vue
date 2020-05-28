<template>
  <div v-if="conversationId" class="app-view conversations-view">

    <!-- Contact List -->

    <div class="view-inner">

      <!-- Header -->

      <app-header @title="scrollListToTop" style="z-index:2">
        <template slot="buttons-left">
          <app-header-button icon="chevron-left" @click.native="hideConversation" />
        </template>
        <template slot="buttons-right">
          <!-- <app-header-button icon="magnifier" /> -->
          <app-header-button icon="user" @click.native="showContact = true" />
        </template>
        <template v-if="contact">
          <template slot="title" v-if="contact.first || contact.last">{{ contact | displayName }}</template>
          <template slot="title" v-else>{{ contact.primaryPhone | phoneNumber }}</template>
          <template slot="subtitle">On behalf of {{ agentName }}</template>
        </template>
      </app-header>

      <!-- Filter bar -->

      <conversation-filter-bar :filters="filters" @filters-changed="$set($data, 'filters', $event)" />

      <!-- Content -->

      <app-content :shrink="contentShrink">

        <transition name="network-slide">
          <div v-if="offline" class="bad-network">
            Unstable network connection detected.
          </div>
        </transition>

        <!-- Ready -->

        <transition name="fade" @enter="scrollListToBottom(true)">
          <template v-if="ready">
            <list-view
              v-if="messagesList.length"
              ref="listView"
              class="list-view"
              :scroll-offset="28"
              @scroll="listViewScrolled"
              @resize="listViewResized"
              @mounted="listViewMounted"
              @updated="listViewUpdated"
            >

              <!-- <transition-group name="list" tag="div"> -->
                <template v-for="message in messagesList">

                  <!-- Notes -->

                  <div v-if="message.attributes && message.attributes.type === 'note'" :key="message._id" class="list-item lonely-item">
                    <div class="lonely-item-inner">
                      <tap class="context-menu is-for-note" @click.native="showMessageActions(message)">
                        <span class="icon">
                          <span class="icon-ellipsis"></span>
                        </span>
                      </tap>
                      <note
                        :message="message"
                        :message-id="message._id"
                        :conversation-id="conversationId"
                        @note-updated="updateNudges"
                      />
                    </div>
                  </div>

                  <!-- Status -->

                  <status-badge
                    v-if="message.label"
                    :key="message._id"
                    :class="[ 'status-badge', (offline && 'has-bad-network') ]"
                  >
                    {{ message.label }}
                  </status-badge>

                  <status-message
                    v-else-if="message.attributes.type === 'channel-notification'"
                    :key="message._id"
                  >
                    {{ message.body }}
                  </status-message>

                  <!-- Standard messages -->

                  <message
                    v-else-if="message.attributes.type === 'inbound-sms'"
                    class="list-item is-left"
                    type="contact"
                    :key="message._id"
                    :message="message"
                    :senders="senders"
                    :conversation-id="conversationId"
                    @expand-media="lightboxMedia = $event"
                    @context-menu="showMessageActions(message)"
                  />

                  <message
                    v-else-if="message.attributes.type === 'outbound-sms' && message.attributes.origin === 'truUser'"
                    class="list-item is-right"
                    type="agent"
                    :key="message._id"
                    :message="message"
                    :senders="senders"
                    :conversation-id="conversationId"
                    @expand-media="lightboxMedia = $event"
                    @context-menu="showMessageActions(message)"
                  />

                  <message
                    v-else-if="message.attributes.type === 'outbound-sms' && message.attributes.origin === 'gabby'"
                    class="list-item is-right"
                    type="gabbi"
                    :key="message._id"
                    :message="message"
                    :senders="senders"
                    :conversation-id="conversationId"
                    @context-menu="showMessageActions(message)"
                  />

                  <!-- Emails -->

                  <message v-else-if="message.attributes.type === 'inbound-email'"
                    class="list-item is-left"
                    type="contact"
                    :key="message._id"
                    :message="message"
                    :senders="senders"
                    :sender-fn="emailSender"
                    :conversation-id="conversationId"
                    @context-menu="showMessageActions(message)"
                  >
                    <email-message
                      type="contact"
                      :conversation-id="conversationId"
                      :message="message"
                    />
                  </message>

                  <message v-else-if="message.attributes.type === 'outbound-email' && message.attributes.origin === 'truUser'"
                    class="list-item is-right"
                    type="agent"
                    :key="message._id"
                    :message="message"
                    :senders="senders"
                    :sender-fn="emailSender"
                    :conversation-id="conversationId"
                    @context-menu="showMessageActions(message)"
                  >
                    <email-message
                      type="agent"
                      :conversation-id="conversationId"
                      :message="message"
                    />
                  </message>

                  <!-- Calls -->

                  <message
                    v-else-if="message.attributes.type === 'inbound-call'"
                    class="list-item"
                    type="contact"
                    :key="message._id"
                    :message="message"
                    :senders="senders"
                    :conversation-id="conversationId"
                    @context-menu="showMessageActions(message)"
                  >
                    <voice-message
                      type="contact"
                      :message="message"
                      @playing-call="hideVoiceCalls"
                    />
                  </message>

                  <message
                    v-else-if="message.attributes.type === 'outbound-call' && message.attributes.origin === 'truUser'"
                    class="list-item"
                    type="agent"
                    :key="message._id"
                    :message="message"
                    :senders="senders"
                    :conversation-id="conversationId"
                    @context-menu="showMessageActions(message)"
                  >
                    <voice-message
                      type="agent"
                      :message="message"
                      @playing-call="hideVoiceCalls"
                    />
                  </message>

                  <!-- Nudge -->

                  <div class="list-item lonely-item"
                    v-else-if="message.attributes.type === 'nudge' && message.attributes.notification.type === 'reminder'"
                    :key="message._id"
                  >
                    <status-message v-if="message.attributes.notification.dismissed">
                      You dismissed a reminder.<br />
                      <a class="link" @click="editAddParent = message._id, editAddNote = message.attributes.notification.messageId">
                        Show Me
                      </a>
                    </status-message>
                    <message
                      class="lonley-item-inner"
                      type="action"
                      v-else
                      :message="message"
                      :senders="senders"
                      :is-lonely="true"
                      :conversation-id="conversationId"
                      :has-context-menu="false"
                    >
                      <strong>Reminder</strong><br />
                      <note-body
                        :message="message.extra.message"
                        :primary="true"
                        @item-checked="itemChecked($event, message.extra.message)"
                      />

                      <template slot="actions">
                        <message-actions :is-lonely="true">
                          <button class="button is-outline is-icon" @click="dismissReminder(message)">
                            <span class="icon">
                              <span class="icon-clock"></span>
                            </span>
                          </button>
                          <button class="button is-primary" @click="editAddParent = message._id, editAddNote = message.attributes.notification.messageId">
                            Show Me
                          </button>
                        </message-actions>
                      </template>
                    </message>
                  </div>

                  <!-- <div v-else :key="Math.random()" class="list-item"><pre class="pad">{{ message }}</pre></div> -->

                </template>
              <!-- </transition-group> -->

            </list-view>

            <!-- Empty -->

            <div class="empty flex is-centered" v-else>
              <div class="flex-item">
                <empty-view>
                  <template slot="img">
                    <img src="@/assets/empty-messages@2x.png" width="90" />
                  </template>
                  This is the start of something great.<br />
                  Send a message below.
                </empty-view>
              </div>
            </div>

          </template>
        </transition>

        <!-- Error -->

        <div class="error flex is-centered" v-if="error">
          <div class="flex-item">
            <error-view />
          </div>
        </div>

        <!-- Loading -->

        <div class="loading flex is-centered" v-else>
          <div class="flex-item"></div>
        </div>

        <!-- Scroll to bottom -->

        <transition name="button-slide">
          <tap-button v-if="!scrolledToBottom" class="button is-primary scroll-button is-small" style="z-index:3" @click.native="scrollListToBottom">
            <span class="icon">
              <span class="icon-arrow-down"></span>
            </span>
          </tap-button>
        </transition>

      </app-content>

      <!-- Message bar -->

      <message-bar
        ref="messageBar"
        :loading="!conversation || sendingMessage"
        @send-message="sendMessage"
        @start-call="startCall"
        @show-actions="showMessageBarActions = true"
      />

      <!-- Create/edit note modal -->

      <note-editor-modal
        style="z-index:4"
        :visible="editAddNote !== undefined"
        :message="editAddNote"
        :conversation-id="conversationId"
        @close="editAddNote = undefined"
        @saved="noteSaved"
        @note-updated="noteUpdated"
      />

      <!-- Contact profile drawer -->

      <drawer v-if="conversation && conversation.contact" :visible="showContact" style="z-index:5">
        <contact
          ref="contact"
          :route="`conversations/${conversationId}/profile`"
          :contact-id="conversation.contact._id"
          :hide-call-button="true"
          @updated="contactUpdated"
          @removed="contactRemoved"
          @hide="showContact = false"
        />
      </drawer>

      <!-- Message actions -->

      <actions-list :visible="messageActionsMessage !== undefined" @close-actions="messageActionsMessage = undefined" style="z-index:6">
        <actions-list-button icon="list3" @click.native="addHintToMessage(messageActionsMessage)">
          <template v-if="messageActionsMessage && messageActionsMessage.attributes.note">Edit Note</template>
          <template v-else>Add a Note</template>
          <template slot="hint">
            A note, task or reminder
          </template>
        </actions-list-button>
        <actions-list-button v-if="messageActionsMessage && messageActionsMessage.attributes.type.includes('email')" icon="envelope-open" @click.native="showEmail(messageActionsMessage)">
          View Full Email
        </actions-list-button>
      </actions-list>

      <!-- Message bar actions -->

      <actions-list :visible="showMessageBarActions" @close-actions="showMessageBarActions = false" style="z-index:6">
        <actions-list-button icon="list3" @click.native="addHintToTimeline">
          Add a Note
          <template slot="hint">
            A note, task or reminder
          </template>
        </actions-list-button>

        <template v-if="mobile">
          <actions-list-button icon="camera2" @click.native="openCamera('camera')">
            Take Photo
          </actions-list-button>
          <actions-list-button icon="picture" @click.native="openCamera('library')">
            Send Photo
          </actions-list-button>
        </template>

        <actions-list-button icon="picture" v-else>
          Send Photo
          <template slot="extra">
            <file-input-trigger accept="image/*" @change="startFileUpload" />
          </template>
        </actions-list-button>
      </actions-list>

      <!-- Media lightbox -->

      <lightbox
        type="image"
        style="z-index:7"
        :src="lightboxMedia && lightboxMedia.url"
        @close="lightboxMedia = undefined"
      />

      <!-- Send media modal -->

      <send-media-modal
        style="z-index:7"
        :media="sendMedia"
        :visible="sendMedia !== undefined"
        @send="sendMediaMessage"
        @close="sendMedia = undefined"
      />

    </div>

  </div>
</template>

<script>
import delayIfUnready from '@/mixins/delay-if-unready.js'

import Note from '@/components/conversation/Note.vue'
import Modal from '@/components/mobile/Modal.vue'
import Drawer from '@/components//Drawer.vue'
import Contact from '@/views/mobile/Contact.vue'
import Lightbox from '@/components/Lightbox.vue'
import ListView from '@/components/ListView.vue'
import EmptyView from '@/components/EmptyView.vue'
import ErrorView from '@/components/ErrorView.vue'
import AppHeader from '@/components/mobile/AppHeader.vue'
import AppContent from '@/components/mobile/AppContent.vue'
import MessageBar from '@/components/conversation/MessageBar.vue'
import MessageActions from '@/components/conversation/MessageActions.vue'
import ActionsList from '@/components/mobile/ActionsList.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import EmailMessage from '@/components/conversation/EmailMessage.vue'
import VoiceMessage from '@/components/conversation/VoiceMessage.vue'
import StatusMessage from '@/components/conversation/StatusMessage.vue'
import AppHeaderButton from '@/components/mobile/AppHeaderButton.vue'
import FileInputTrigger from '@/components/FileInputTrigger.vue'
import ActionsListButton from '@/components/mobile/ActionsListButton.vue'
import SendMediaModal from '@/components/SendMediaModal.vue'
import NoteEditorModal from '@/components/conversation/mobile/NoteEditorModal.vue'
import ConversationFilterBar from '@/components/conversation/mobile/ConversationFilterBar.vue'

import Message from '@/components/conversation/Message.vue'
import MessageLink from '@/components/conversation/MessageLink.vue'
import MessageTasks from '@/components/conversation/MessageTasks.vue'
import MessageShowings from '@/components/conversation/MessageShowings.vue'
import MessageConfirmation from '@/components/conversation/MessageConfirmation.vue'
import MessageShowingsConfirmation from '@/components/conversation/MessageShowingsConfirmation.vue'
import NoteBody from '@/components/conversation/NoteBody.vue'

import on from './mixins/on.js'
import methods from './mixins/methods.js'
import computed from './mixins/computed.js'

export default {
  name: 'ConversationView',

  inject: [
    'cordova',
    'Camera'
  ],

  mixins: [
    on,
    methods,
    computed,
    delayIfUnready
  ],

  components: {
    Note,
    NoteBody,
    Modal,
    Drawer,
    Contact,
    Lightbox,
    ListView,
    EmptyView,
    ErrorView,
    AppHeader,
    AppContent,
    MessageBar,
    MessageActions,
    ActionsList,
    StatusBadge,
    EmailMessage,
    VoiceMessage,
    StatusMessage,
    AppHeaderButton,
    FileInputTrigger,
    ActionsListButton,
    SendMediaModal,
    NoteEditorModal,
    ConversationFilterBar,

    Message,
    MessageLink,
    MessageTasks,
    MessageShowings,
    MessageConfirmation,
    MessageShowingsConfirmation
  },

  props: {
    conversationId: {
      type: [ String, undefined ],
      required: true
    }
  },

  data () {
    return {
      showContact: false,
      offline: false,
      sendMedia: undefined,
      sendMediaFiles: undefined,
      editAddNote: undefined,
      editAddParent: undefined,
      lightboxMedia: undefined,
      sendingMessage: false,
      scrollDebounce: null,
      scrolledToBottom: true,
      messageActionsMessage: undefined,
      showMessageBarActions: false,
      errors: {
        messages: false,
        conversation: false
      },
      filters: {
        mms: true,
        sms: true,
        email: true,
        notes: true,
        calls: true
      }
    }
  },

  created () {
    this.delayIfUnready(() => {
      this.fetchConversation()
      this.fetchMessages(true)
    })
  }
}
</script>

<style lang="sass" scoped>
@import "./index.sass"
</style>
