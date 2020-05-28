<template>
  <div v-if="contactId" class="app-view contact-view">

    <!-- Contact -->

    <div class="view-inner">

      <!-- Header -->

      <app-header>
        <template slot="buttons-left">
          <app-header-button icon="chevron-left" @click.native="hideContact" />
        </template>
        <template slot="buttons-right">
          <app-header-button icon="pencil-line" @click.native="showEditModal = true" />
        </template>
        <template slot="title">
          <transition name="fade"><span v-if="contact">{{ contact | displayName }}</span></transition>
        </template>
      </app-header>

      <!-- Content -->

      <app-content :shrink="contentShrink" :scroll="true">
        <transition name="fade">

          <!-- Ready -->

          <template v-if="contact">
            <div class="pad-lg">

              <!-- Header -->

              <header class="flex is-row content">
                <h1 class="flex-item title is-4 has-text-weight-light" style="margin:0">
                  <span>{{ contact | displayName }}</span><br />
                  <span class="tag status-tag" v-if="contact.buyer || contact.seller">
                    <template v-if="contact.buyer && contact.seller">Buyer/Seller</template>
                    <template v-else-if="contact.seller">Seller</template>
                    <template v-else-if="contact.buyer">Buyer</template>
                  </span>
                </h1>
                <div v-if="!hideCallButton && contact.primaryPhone" class="flex-item contact-controls is-aligned-right flex is-row">
                  <div class="field has-addons">
                    <p class="control">
                      <tap-button class="button is-icon is-medium is-primary-light" @click.native="startCall">
                        <span class="icon">
                          <span class="icon-telephone"></span>
                        </span>
                      </tap-button>
                    </p>
                    <p class="control">
                      <tap-button class="button is-icon is-medium is-primary-light" @click.native="startConversation">
                        <span class="icon">
                          <span class="icon-bubbles"></span>
                        </span>
                      </tap-button>
                    </p>
                  </div>
                </div>
              </header>

              <!-- Profile -->

              <div class="content">

                <!-- Phone -->

                <div class="field">
                  <label class="label">Phone Numbers</label>
                  <div v-if="contact.primaryPhone" class="control flex is-row">
                    <icon-link icon="telephone" @click.native="startCall">{{ contact.primaryPhone | phoneNumber }}</icon-link>
                    <small class="link-label">Primary</small>
                  </div>
                  <div v-if="contact.otherPhones" v-for="phone in contact.otherPhones" class="control" :key="phone.phone">
                    <icon-link icon="telephone">{{ phone.phone | phoneNumber }}</icon-link>
                  </div>
                  <div v-if="!contact.primaryPhone && !contact.otherPhones" class="control">
                    <icon-link @click.native="showEditModal = true">Add phone number</icon-link>
                  </div>
                </div>

                <!-- Email -->

                <div class="field">
                  <label class="label">Email</label>
                  <div v-if="contact.email" class="control flex is-row">
                    <icon-link v-if="contact.email" icon="envelope-open" :href="`mailto:${contact.email}`">{{ contact.email }}</icon-link>
                    <small class="link-label">Primary</small>
                  </div>
                  <div v-if="contact.otherEmails" v-for="email in contact.otherEmails" class="control" :key="email.email">
                    <icon-link v-if="email.email" icon="envelope-open" :href="`mailto:${email.email}`">{{ email.email }}</icon-link>
                  </div>
                  <div v-if="!contact.email && !contact.otherEmails" class="control">
                    <icon-link @click.native="showEditModal = true">Add email</icon-link>
                  </div>
                </div>

                <!-- Addresses -->

                <div class="field address-field">
                  <label class="label">Addresses</label>
                  <div v-if="contact.homeAddress" class="control">
                    <div class="control-item flex">
                      <span class="icon is-soft flex-item"><span class="icon-home4"></span></span>
                      <span class="flex-item">
                        <div>{{ contact.homeAddress.line1 }}</div>
                        <div v-if="contact.homeAddress.line2">{{ contact.homeAddress.line2 }}</div>
                        <div class="address-items">
                          <span v-for="(item, i) in addressItems(contact.homeAddress)" :key="i">{{ item }}</span>
                        </div>
                      </span>
                      <small class="is-soft flex-item is-aligned-right">Home</small>
                    </div>
                  </div>
                  <div v-if="contact.workAddress" class="control">
                    <div class="control-item flex">
                      <span class="icon is-soft flex-item"><span class="icon-city"></span></span>
                      <span class="flex-item">
                        <div>{{ contact.workAddress.line1 }}</div>
                        <div v-if="contact.workAddress.line2">{{ contact.workAddress.line2 }}</div>
                        <div class="address-items">
                          <span v-for="(item, i) in addressItems(contact.workAddress)" :key="i">{{ item }}</span>
                        </div>
                      </span>
                      <small class="is-soft flex-item is-aligned-right">Work</small>
                    </div>
                  </div>
                  <div v-if="!contact.homeAddress && !contact.workAddress" class="control">
                    <icon-link @click.native="showEditModal = true">Add address</icon-link>
                  </div>
                </div>

                <!-- Birthday -->

                <div class="field address-field">
                  <label class="label">Birthday</label>
                  <div v-if="birthday" class="control">
                    <div class="control-item">
                      <span class="icon is-soft"><span class="icon-gift"></span></span>
                      <span>{{ birthday }}</span>
                    </div>
                  </div>
                  <div v-else class="control">
                    <icon-link  @click.native="showEditModal = true">Add birthday</icon-link>
                  </div>
                </div>

              </div>

            </div>
          </template>

          <!-- Error -->

          <div class="error flex is-centered" v-else-if="error">
            <div class="flex-item">
              <error-view />
            </div>
          </div>

        </transition>
      </app-content>

      <!-- Contact actions -->

      <!-- <action-button class="action-button" @tapped="showActions = true">
        <span class="icon-plus"></span>
      </action-button> -->

      <actions-list :visible="showActions" @close-actions="showActions = false">
        <actions-list-button icon="file-add">
          <template slot="text">Attach Document</template>
        </actions-list-button>
        <actions-list-button icon="calendar-empty">
          <template slot="text">Schedule Showing</template>
        </actions-list-button>
        <actions-list-button icon="list3">
          <template slot="text">Create Hint</template>
          <template slot="hint">A note, task, or reminder.</template>
        </actions-list-button>
      </actions-list>

      <!-- Edit contact modal -->

      <modal v-if="contact" :visible="showEditModal" :close-button="false" :tall="true" style="z-index:1">
        <div class="content">
          <h1 class="title is-5">Edit Contact</h1>
          <contact-form ref="contactForm" @submit="editSubmit" :contact="contact" />
        </div>
        <template slot="controls-left">
          <div class="field">
            <p class="control">
              <tap-button class="button is-medium is-outline is-icon" @click.native="cancelChanges" :disabled="updatingContact">
                <span class="icon"><span class="icon-cross"></span></span>
              </tap-button>
            </p>
          </div>
          <div class="field">
            <p class="control">
              <tap-button class="button is-medium is-inline is-icon" @click.native="showRemoveModal = true" :disabled="updatingContact">
                <span class="icon"><span class="icon-trash2"></span></span>
              </tap-button>
            </p>
          </div>
        </template>
        <template slot="controls-right">
          <div class="field">
            <p class="control">
              <tap-button :class="[ 'button', 'is-medium', 'is-primary', updatingContact && 'is-loading' ]" :disabled="updatingContact" @click.native="$refs.contactForm.submit">
                <span class="icon"><span class="icon-check"></span></span>
                <span>Save</span>
              </tap-button>
            </p>
          </div>
        </template>
      </modal>

      <!-- Remove contact modal -->

      <modal v-if="contact" :visible="showRemoveModal" :close-button="false" style="z-index:2">
        <div class="content">
          <h1 class="title is-5">Remove Contact</h1>
          <p>Are you sure you want to remove this contact?</p>
          <div class="message is-danger" style="margin-bottom:0">
            <div class="message-body">
              <small>
                This will remove this contact and <strong>all conversations</strong> for you and <strong>everyone on your team</strong>.
              </small>
              <label class="flex is-row" style="margin:0.5rem 0 0 -10px">
                <span class="flex-item">
                  <input-checkbox :checked="canRemove" @change="canRemove = !canRemove" />
                </span>
                <span class="flex-item">I'm absolutely sure.</span>
              </label>
            </div>
          </div>
        </div>
        <template slot="controls-left">
          <div class="field">
            <p class="control">
              <tap-button class="button is-medium is-outline is-icon" @click.native="cancelRemove" :disabled="removingContact">
                <span class="icon"><span class="icon-cross"></span></span>
              </tap-button>
            </p>
          </div>
        </template>
        <template slot="controls-right">
          <div class="field">
            <p class="control">
              <tap-button :class="[ 'button', 'is-medium', 'is-primary', removingContact && 'is-loading' ]" @click.native="removeContact" :disabled="!canRemove || removingContact">
                <span class="icon"><span class="icon-trash2"></span></span>
                <span>Remove</span>
              </tap-button>
            </p>
          </div>
        </template>
      </modal>

    </div>

  </div>
</template>

<script>
import months from '@/helpers/months.js'
import filters from '@/helpers/filters.js'
import delayIfUnready from '@/mixins/delay-if-unready.js'
import newConversation from '@/helpers/new-conversation.js'

import Modal from '@/components/mobile/Modal.vue'
import IconLink from '@/components/form/IconLink.vue'
import ErrorView from '@/components/ErrorView.vue'
import AppHeader from '@/components/mobile/AppHeader.vue'
import AppContent from '@/components/mobile/AppContent.vue'
import ActionsList from '@/components/mobile/ActionsList.vue'
import ContactForm from '@/components/contact/ContactForm.vue'
import ActionButton from '@/components/ActionButton.vue'
import InputCheckbox from '@/components/form/InputCheckbox.vue'
import AppHeaderButton from '@/components/mobile/AppHeaderButton.vue'
import ActionsListButton from '@/components/mobile/ActionsListButton.vue'

export default {
  name: 'ContactView',

  mixins: [ delayIfUnready ],

  components: {
    Modal,
    IconLink,
    ErrorView,
    AppHeader,
    AppContent,
    ActionsList,
    ContactForm,
    ActionButton,
    InputCheckbox,
    AppHeaderButton,
    ActionsListButton
  },

  props: {
    route: {
      type: String,
      required: true
    },
    contactId: {
      type: [ String, undefined ],
      required: true
    },
    hideCallButton: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      error: false,
      canRemove: false,
      showActions: false,
      updatingContact: false,
      removingContact: false,
      showEditModal: false,
      showRemoveModal: false
    }
  },

  computed: {
    hasNotch () {
      return this.$store.getters.hasNotch
    },

    contact () {
      return this.$store.state.contacts.contact
    },

    contactList () {
      return this.$store.state.contacts.list
    },

    birthday () {
      if (!this.contact || !this.contact.birthday) return false

      const { day, year, month } = this.contact.birthday

      return `${months[month-1].name} ${day}, ${year}`
    },

    contentShrink () {
      return this.hasNotch ? AppHeader.HEADER_HEIGHT_NOTCH : AppHeader.HEADER_HEIGHT
    }
  },

  on: {
    resume () {
      this.fetchContact()
    },

    reconnect () {
      this.fetchContact()
    },

    backButton () {
      if (this.showRemoveModal) {
        this.showRemoveModal = false
      } else if (this.showEditModal) {
        this.showEditModal = false
      } else {
        this.hideContact()
      }
    }
  },

  created () {
    this.delayIfUnready(() => {
      this.fetchContact()
    })
  },

  methods: {
    fetchContact () {
      const { contactId } = this

      this.$store
        .dispatch('contacts/fetchContact', contactId)
        .then(res => {
          if (res.error) {
            this.$set(this, 'error', res)
            return
          }
        })
        .catch(err => {
          this.$set(this, 'error', err)
        })
    },

    removeContact () {
      this.removingContact = true

      this.$store
        .dispatch('contacts/deleteContact')
        .then(res => {
          this.removingContact = false

          if (res.error) {
            this.$store.dispatch('notifications/show', { type: 'error', message: res.error })
            return
          }

          this.$emit('removed', res)
        })
        .catch(() => {
          this.removingContact = false
          this.$store.dispatch('notifications/show', { type: 'error', message: 'Error removing contact.' })
        })
    },

    editSubmit (data) {
      this.updatingContact = true

      const original = JSON.parse(JSON.stringify(this.contact))
      for (let key in original) {
        if (data[key] === undefined) {
          this.$delete(original, key)
        }
      }
      const contact = Object.assign({}, original, data)

      this.$store
        .dispatch('contacts/updateContact', contact)
        .then(res => {
          this.updatingContact = false

          if (res.error) {
            this.$store.dispatch('notifications/show', { type: 'error', message: res.error })
            return
          }

          this.showEditModal = false
        })
        .catch(() => {
          this.updatingContact = false
          this.$store.dispatch('notifications/show', { type: 'error', message: 'Error updating contact.' })
        })
    },

    addressItems (address) {
      const items = []
      if (address.postal) items.push(address.postal)
      if (address.city) items.push(address.city)
      if (address.state) items.push(address.state)
      return items
    },

    hideContact () {
      this.$emit('hide')
    },

    cancelChanges () {
      this.showEditModal = false
      // this.$refs.contactForm.reset()
    },

    cancelRemove () {
      this.showRemoveModal = false
    },

    startCall () {
      const { contactId } = this

      const success = (conversation) => {
        this.$store.dispatch('calls/start', {
          id: conversation._id,
          displayName: filters.displayName(this.contactList.find(c => c._id === contactId))
        })

        this.$store.dispatch('conversations/fetchList')
        this.$emit('call-started', conversation._id)
      }

      const error = (message) => {
        this.$store.dispatch('notifications/show', { type: 'error', message })
        this.$emit('call-failed')
      }

      newConversation.call(this, contactId, success, error)
    },

    startConversation () {
      const { contactId } = this

      const success = (conversation) => {
        this.$store.dispatch('conversations/fetchList')
        this.$emit('conversation-started', conversation._id)
      }

      const error = (message) => {
        this.$store.dispatch('notifications/show', { type: 'error', message })
        this.$emit('conversation-failed')
      }

      newConversation.call(this, contactId, success, error)
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.view-inner
  top: 0
  left: 0
  width: 100%
  height: 100%
  position: absolute
  background: $gabbi-grey-3

.empty,
.error,
.loading
  height: 100%

.action-button
  right: $margin-lg
  bottom: $margin-lg
  position: absolute

.contact-controls
  .control
    &:first-child
      margin: 0

.control-item
  padding: $margin-sm 0
  .icon
    margin-right: $margin-sm

.address-items
  span
    &:not(:last-child):after
      content: ', '
      display: inline

.link-label
  color: $gabbi-grey-0
  margin-left: auto

.status-tag:not(body)
  color: $gabbi-teal
  min-width: 100px
  height: 1.5rem
  margin-top: 0.5rem
  padding: 0 0.5rem
  font-size: $font-size-sm
  background: transparent
  font-weight: normal
  line-height: 1.5rem
  border: solid 1px $gabbi-teal
  border-radius: $border-radius-x-sm
  background: $gabbi-grey-3

/* Transitions */

.fade-enter-active,
.fade-leave-active
  transition: opacity $tx-duration-sm $tx-ease

.fade-enter,
.fade-leave-to
  opacity: 0

</style>
