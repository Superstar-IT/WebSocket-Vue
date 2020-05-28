<template>
  <div :class="{ 'app-view': true, 'contacts-view': true, 'has-notch': hasNotch }">

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
        <template slot="title">Contacts</template>
      </app-header>

      <!-- Filter bar -->

      <contact-filter-bar />

      <!-- Content -->

      <app-content :shrink="contentShrink">

        <!-- Ready -->

        <template v-if="contactList">

          <!-- List view -->

          <animeta-transition :to="{ scale: 1, opacity: 1 }" :from="{ scale: 0.85, opacity: 0 }" :options="{ easing: 'easeInOutQuad', duration: 150 }">
            <list-view v-if="contactList.length" :itemHeight="itemHeight" ref="listView">
              <contact-list-item
                v-for="(contact, i) in contactList"
                class="list-item"
                :key="contact._id"
                :index="i"
                :contact="contact"
                @click.native="showContact(contact._id)"
              />
            </list-view>
          </animeta-transition>

          <!-- Empty -->

          <animeta-transition :to="{ scale: 1, opacity: 1 }" :from="{ scale: 0.85, opacity: 0 }" :options="{ easing: 'easeInOutQuad', duration: 150 }">
            <div v-if="!contactList.length" class="empty flex is-centered">
              <div class="flex-item">
                <empty-view>
                  <template slot="img">
                    <img src="@/assets/empty-contacts@2x.png" width="90" />
                  </template>
                  It's awfully lonely in here...<br />
                  Why not add a contact?
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

      <!-- Create contact button -->

      <action-button class="action-button" :disabled="!connected" @tapped="showCreateModal = true" @disabled="showOfflineMsg">
        <span class="icon-plus"></span>
      </action-button>

      <!-- Create contact modal -->

      <modal :visible="showCreateModal" :close-button="false" :tall="true" style="z-index:1">
        <div class="content">
          <h1 class="title is-5">Create Contact</h1>
          <contact-form ref="contactForm" @submit="createSubmit" />
        </div>
        <template slot="controls-left">
          <div class="field">
            <p class="control">
              <tap-button class="button is-medium is-outline is-icon" @click.native="cancelCreate" :disabled="creatingContact">
                <span class="icon"><span class="icon-cross"></span></span>
              </tap-button>
            </p>
          </div>
        </template>
        <template slot="controls-right">
          <div class="field">
            <p class="control">
              <tap-button :class="[ 'button', 'is-medium', 'is-primary', creatingContact && 'is-loading' ]" :disabled="!connected || creatingContact" @click.native="$refs.contactForm.submit()">
                <span class="icon"><span class="icon-plus"></span></span>
                <span>Create</span>
              </tap-button>
            </p>
          </div>
        </template>
      </modal>

      <!-- Conflict modal -->

      <modal :visible="showNewConflictModal" :close-button="false" style="z-index:2">
        <div class="content">
          <h1 class="title is-5">Contact Already Exists</h1>
          <p>A contact with that phone number already exists. <!-- Would you like to view that contact? --></p>
        </div>
        <template slot="controls-left">
          <div class="field">
            <p class="control">
              <tap-button class="button is-medium is-outline is-icon" @click.native="$router.back()">
                <span class="icon"><span class="icon-cross"></span></span>
              </tap-button>
            </p>
          </div>
        </template>
        <!-- <template slot="controls-right">
          <div class="field">
            <p class="control">
              <tap-button class="button is-primary is-medium" @click.native="showConflictContact">
                <span class="icon"><span class="icon-user"></span></span>
                <span>Show Me</span>
              </tap-button>
            </p>
          </div>
        </template> -->
      </modal>

      <!-- Contact search -->

      <contact-search-modal
        title="Find a Contact"
        :visible="showSearchModal"
        @close="showSearchModal = false"
        @contact="showContact($event)"
        style="z-index:3"
      />

      <!-- Contact profile drawer -->

      <drawer :visible="$route.params.contactId !== undefined" style="z-index:4">
        <contact
          ref="contact"
          :route="`contacts/${$route.params.contactId}`"
          :contact-id="$route.params.contactId"
          @removed="$router.replace({ path: '/contacts' })"
          @hide="hideContact"
          @call-started="$router.replace({ path: `/conversations/${$event}` })"
          @conversation-started="$router.replace({ path: `/conversations/${$event}` })"
        />
      </drawer>

    </div>

  </div>
</template>

<script>
import Contact from '@/views/mobile/Contact.vue'

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
import AppHeaderButton from '@/components/mobile/AppHeaderButton.vue'
import ContactListItem from '@/components/contact/ListItem.vue'
import ContactFilterBar from '@/components/contact/mobile/ContactFilterBar.vue'
import ContactSearchModal from '@/components/contact/mobile/ContactSearchModal.vue'

export default {
  name: 'ContactsView',

  components: {
    Modal,
    Drawer,
    Contact,
    ListView,
    EmptyView,
    ErrorView,
    AppHeader,
    AppContent,
    ContactForm,
    ActionButton,
    AppHeaderButton,
    ContactListItem,
    ContactFilterBar,
    ContactSearchModal
  },

  data () {
    return {
      error: false,
      creatingContact: false,
      conflictContactId: undefined,
      showCreateModal: false,
      showNewConflictModal: false,
      showEditConflictModal: false,
      showSearchModal: false
    }
  },

  computed: {
    hasNotch () {
      return this.$store.getters.hasNotch
    },

    connected () {
      return this.$store.state.connected
    },

    contacts () {
      return this.$store.state.contacts
    },

    itemHeight () {
      return ListItem.LIST_ITEM_HEIGHT
    },

    contactList () {
      return this.contacts && this.contacts.list
    },

    contentShrink () {
      const headerHeight = this.hasNotch ? AppHeader.HEADER_HEIGHT_NOTCH : AppHeader.HEADER_HEIGHT
      const homeIndicatorOffset = this.hasNotch ? 20 : 0

      return AppTabs.TAB_HEIGHT + headerHeight + AppFilterBar.FILTER_BAR_HEIGHT + homeIndicatorOffset
    }
  },

  on: {
    resume () {
      this.fetchContacts()
    },

    reconnect () {
      this.fetchContacts()
    },

    backButton () {
      if (this.showNewConflictModal) {
        this.showNewConflictModal = false
      } else if (this.showEditConflictModal) {
        this.showEditConflictModal = false
      } else if (this.showCreateModal) {
        this.showCreateModal = false
      } else if (this.showSearchModal) {
        this.showSearchModal = false
      }
    }
  },

  created () {
    this.fetchContacts()
  },

  methods: {
    fetchContacts () {
      this.$store
        .dispatch('contacts/fetchList')
        .then(res => {
          if (res.error) {
            this.$set(this, 'error', res)
            this.$store.dispatch('notifications/show', { type: 'error', message: 'Error fetching contacts.' })
            return
          }
        })
        .catch(err => {
          this.$set(this, 'error', err)
          this.$store.dispatch('notifications/show', { type: 'error', message: 'Error fetching contacts.' })
        })
    },

    hideContact () {
      this.$router.back()
    },

    showContact (contactId) {
      if (this.$route.meta.screen === 'search-contacts') {
        this.$router.replace({ path: `/contacts` })
      }
      this.$router.push({ path: `/contacts/${contactId}` })
    },

    showConflictContact () {
      history.go(-2) // -> edit -> contacts
      this.showContact(this.conflictContactId)
    },

    scrollListToTop () {
      this.$refs.listView.scrollToTop()
    },

    cancelCreate () {
      this.showCreateModal = false
      // this.$refs.contactForm.reset()
    },

    createSubmit (newContact) {
      this.creatingContact = true

      this.$store
        .dispatch('contacts/createContact', newContact)
        .then(res => {
          this.creatingContact = false

          if (res.error) {

            if (res.error && res.error.error === 'conflict') {
              // this.showNewConflictModal = true
              this.$store.dispatch('notifications/show', { type: 'error', message: 'A contact with this phone number already exists.' })
            }
            else {
              this.$store.dispatch('notifications/show', { type: 'error', message: 'Error creating contact.' })
            }

            return
          }

          this.$router.replace({ path: `/contacts/${res._id}` })
        })
        .catch(() => {
          this.creatingContact = false
          this.$store.dispatch('notifications/show', { type: 'error', message: 'Error creating contact.' })
        })
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
