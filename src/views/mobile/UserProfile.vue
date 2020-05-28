<template>
  <div class="app-view user-profile-view">

    <close-button class="modal-close-button" direction="left" @click.native="$emit('close')"></close-button>

    <div class="view-inner">
      <app-content :scroll="true">
        <div class="pad-lg">

          <!-- Profile -->

          <header class="flex is-row content">
            <h2 class="flex-item title is-4 has-text-weight-light" style="margin:0">
              Account
            </h2>
          </header>

          <div class="content">
            <p>
              <!-- Update your display name and profile picture here.
              These are displayed to other members on your team. -->
              If you need to change your name, email, or virtual number, please contact support.
              <br />
              <a class="link" href="mailto:support@gabbi.ai">Contact Us</a>
            </p>

            <!-- <div class="field">
              <label class="label">Profile Picture</label>
              <div class="control flex is-row">
                input
              </div>
            </div> -->

            <div class="field">
              <label class="label">Display Name</label>
              <div class="control flex is-row">
                <input type="text" class="input" spellcheck="false" autocorrect="off" :disabled="true" :value="user.displayName">
              </div>
            </div>

            <div class="field">
              <label class="label">Email Address</label>
              <div class="control flex is-row">
                <input type="text" class="input" spellcheck="false" autocorrect="off" :disabled="true" :value="user.email">
              </div>
            </div>

            <div class="field">
              <label class="label">Virtual Number</label>
              <div class="control flex is-row">
                <input type="text" class="input" spellcheck="false" autocorrect="off" :disabled="true" :value="virtualNumber">
              </div>
            </div>
          </div>

          <br />

          <!-- Integrations -->

          <header class="flex is-row content">
            <h2 class="flex-item title is-4 has-text-weight-light" style="margin:0">
              Integrations
            </h2>
          </header>

          <div class="content">
            <p>
              Connect third-party accounts to unlock additional features in Gabbi.
            </p>
            <integrations :user="user" />
          </div>

          <br />

          <!-- Dev tools -->

          <header class="flex is-row content">
            <h2 class="flex-item title is-4 has-text-weight-light" style="margin:0">
              Diagnostics
            </h2>
          </header>

          <div class="content">
            <p>
              <tap-link class="link" @click.native="sendReport">Send Diagnostic Report</tap-link>
            </p>
          </div>

        </div>
      </app-content>
    </div>

  </div>
</template>

<script>
import filters from '@/helpers/filters.js'
import grandcentral from '@/api/grandcentral.js'

import Avatar from '@/components/Avatar.vue'
import AppContent from '@/components/mobile/AppContent.vue'
import LetterCrest from '@/components/LetterCrest.vue'
import CloseButton from '@/components/CloseButton.vue'
import Integrations from '@/components/Integrations.vue'

export default {
  name: 'UserProfileView',

  components: {
    Avatar,
    AppContent,
    LetterCrest,
    CloseButton,
    Integrations
  },

  computed: {
    user () {
      return this.$store.state.auth.user
    },

    virtualNumber () {
      return filters.phoneNumber(this.user.virtualNumber)
    }
  },

  methods: {
    sendReport () {
      grandcentral.logBug(this.$store.state, {
        diagnosticReport: true
      }).then(() => {
        this.$store.dispatch('notifications/show', { type: 'info', message: 'Report sent.' })
      })
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.user-profile-view
  width: 100%
  height: 100%
  position: relative
  background: $gabbi-grey-3

.view-inner
  top: 0
  left: 0
  width: 100%
  height: 100%
  position: absolute
  background: $gabbi-grey-3

.modal-close-button
  top: calc(#{$margin-lg} - 10px)
  right: calc(#{$margin-lg} - 10px)
  z-index: 2
  position: absolute
</style>
