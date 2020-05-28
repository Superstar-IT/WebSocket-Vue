<template>
  <div id="app" class="app app-mobile" v-if="ready">

    <!-- Main view -->

    <transition :name="transitionName">
      <router-view v-if="authenticated" />
    </transition>

    <transition name="auth">
      <auth-view v-if="!authenticated" style="z-index:1" />
    </transition>

    <!-- Call button -->

    <call-button class="call-button" style="z-index:2" />

    <!-- User drawer -->

    <drawer
      v-if="authenticated && $store.state.auth.user"
      width="calc(100% - 30px - 1.25rem - 1.25rem)"
      slide-from="left"
      style="z-index:3"
      :visible="showUserDrawer"
      @background="showUserDrawer = false"
    >
      <user-drawer
        @user="showUser = true"
        @whats-new="showWhatsNew = true"
      />
    </drawer>

    <!-- User profile -->

    <drawer
      v-if="authenticated && $store.state.auth.user"
      width="100%"
      slide-from="left"
      style="z-index:4"
      :visible="showUser"
      @close="showUser = false"
    >
      <user-profile @close="showUser = false, showUserDrawer = false" />
    </drawer>

    <!-- What's new -->

    <modal
      style="z-index:5"
      :tall="true"
      :scroll="true"
      :visible="showWhatsNew"
      @close="showWhatsNew = false, showUserDrawer = false"
    >
      <div class="content whats-new">
        <h1 class="title is-5">What's New</h1>
        <div v-html="whatsNew"></div>
        <br />
      </div>
    </modal>

    <!-- Call modal -->

    <call-modal style="z-index:6" />

    <!-- Notifications -->

    <div class="app-notifications" style="z-index:7">
      <notifications />
    </div>

    <!-- App tabs -->

    <app-tabs tab-selected="conversations" key="appTabs" class="app-tabs" />

  </div>
</template>

<script>
import app from '@/mixins/app.js'
import marked from 'marked'
import changelog from '@/../CHANGELOG.md'

import Modal from '@/components/mobile/Modal.vue'
import Drawer from '@/components/Drawer.vue'
import AppTabs from '@/components/mobile/AppTabs.vue'
import AuthView from '@/views/mobile/Auth.vue'
import CallModal from '@/components/mobile/CallModal.vue'
import CallButton from '@/components/CallButton.vue'
import UserDrawer from '@/components/mobile/UserDrawer/index.vue'
import UserProfile from '@/views/mobile/UserProfile.vue'
import Notifications from '@/components/Notifications.vue'

import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'

export default {
  mixins: [
    app
  ],

  inject: [
    'StatusBar'
  ],

  components: {
    Modal,
    Drawer,
    AppTabs,
    AuthView,
    CallModal,
    CallButton,
    UserDrawer,
    UserProfile,
    Notifications
  },

  on: {
    resume () {
      this.$store.dispatch('setConnected', true)
    },

    connect () {
      this.$store.dispatch('setConnected', true)
    },

    reconnect () {
      this.$store.dispatch('setConnected', true)
    },

    disconnect () {
      this.$store.dispatch('setConnected', false)
    },

    showUserDrawer () {
      this.showUserDrawer = true
    },

    hideUserDrawer () {
      this.showUserDrawer = false
    },

    callStatusChanged (evt) {
      const { $store } = this
      const { status, conversationId } = evt.detail

      if (!$store.state.calls.call || $store.state.calls.call.id !== conversationId) return

      $store.dispatch('calls/setStatus', status)
    },

    backButton () {
      if (this.showWhatsNew) {
        this.showWhatsNew = false
        this.showUserDrawer = false
      } else if (this.showUser) {
        this.showUser = false
        this.showUserDrawer = false
      } else if (this.showUserDrawer) {
        this.showUserDrawer = false
      }
    }
  },

  data () {
    return {
      showUser: false,
      whatsNew: marked(changelog),
      showWhatsNew: false,
      showUserDrawer: false,
      transitionName: 'slide-left'
    }
  },

  created () {
    document.body.addEventListener('wheel', this.preventDefault)
    document.body.addEventListener('scroll', this.preventDefault)
    document.body.addEventListener('touchmove', this.preventDefault)
  },

  destroyed () {
    document.body.removeEventListener('wheel', this.preventDefault)
    document.body.removeEventListener('scroll', this.preventDefault)
    document.body.removeEventListener('touchmove', this.preventDefault)
  },

  methods: {
    preventDefault (evt) {
      console.log(evt)
      evt.preventDefault()
    }
  },

  watch: {
    $route (to, from) {
      const toOrder = to.meta.order
      const fromOrder = from.meta.order

      this.showUserDrawer = false

      this.transitionName = toOrder < fromOrder ? 'slide-right' : 'slide-left'
    }
  }
}
</script>

<style lang="sass">
@import "@/styles/app.sass"

.app-mobile
  input,
  select,
  textarea
    user-select: auto !important

.app-tabs
  left: 0
  right: 0
  bottom: 0
  position: fixed !important

.app-notifications
  left: 0
  right: 0
  bottom: 0
  height: 70px
  z-index: 10
  position: absolute
  pointer-events: none

.call-button
  left: $margin-lg
  bottom: calc(#{$TAB_HEIGHT} + #{$margin-lg})
  position: absolute

.whats-new
  line-height: 1.3
  h1, h4
    color: $gabbi-navy
  h1
    font-size: $font-size-lg
  h4
    color: $gabbi-grey-0
    font-size: $font-size-sm
    font-weight: normal
    margin-top: -0.25rem

/* Transitions */

.app-enter-active,
.app-leave-active
  transition: opacity $tx-duration, transform $tx-duration

.app-enter,
.app-leave-to
  transform: translate3d(100%, 0, 0)

.auth-enter-active,
.auth-leave-active
  transition: transform $tx-duration

.auth-enter,
.auth-leave-to
  transform: translate3d(0, 100%, 0)

.slide-left-enter-active,
.slide-left-leave-active
  transition: opacity $tx-duration, transform $tx-duration

.slide-left-enter
  transform: translate3d(100%, 0, 0)

.slide-left-leave-to
  transform: translate3d(-100%, 0, 0)

.slide-right-enter-active,
.slide-right-leave-active
  transition: opacity $tx-duration, transform $tx-duration

.slide-right-enter
  transform: translate3d(-100%, 0, 0)

.slide-right-leave-to
  transform: translate3d(100%, 0, 0)

.test-back-btn
  position: fixed
  z-index: 10000
  top: 1rem
  right: 1rem
</style>
