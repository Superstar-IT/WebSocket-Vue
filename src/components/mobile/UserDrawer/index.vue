<template>
  <div :class="{ 'user-drawer': true, 'has-notch': $store.getters.hasNotch }">
    <div class="drawer-close">
      <tap class="button" @click.native="$emitGlobal('hideUserDrawer')">
        <span class="icon">
          <span class="icon-chevron-left"></span>
        </span>
      </tap>
    </div>

    <tap class="user pad flex is-row" @click.native="$emit('user')">
      <div class="flex-item user-avatar">
        <avatar v-if="photoUrl" />
        <letter-crest v-else :displayName="user.displayName" />
      </div>
      <div class="flex-item">
        <div class="flex-item">{{ user.displayName }}</div>
        <small class="flex-item is-soft" v-if="contact">{{ contact | phoneNumber }}</small>
      </div>
      <div class="flex-item is-aligned-right pad flex is-row">
        <a class="icon">
          <span class="icon-pencil-line"></span>
        </a>
      </div>
    </tap>

    <aside class="menu pad-lg">
      <p class="menu-label">Navigation</p>
      <ul class="menu-list">
        <li>
          <router-link to="/" :class="[ 'flex', 'is-row', (view === 'conversations') && 'is-active' ]" @click.native="$emitGlobal('hideUserDrawer')">
            <span class="icon">
              <span class="icon-bubbles"></span>
            </span>
            <span>Conversations</span>
          </router-link>
        </li>
        <li>
          <router-link to="/contacts" :class="[ 'flex', 'is-row', (view === 'contacts') && 'is-active' ]" @click.native="$emitGlobal('hideUserDrawer')">
            <span class="icon">
              <span class="icon-users2"></span>
            </span>
            <span>Contacts</span>
          </router-link>
        </li>
      </ul>

      <p class="menu-label">Gabbi.ai</p>
      <ul class="menu-list">
        <li>
          <tap-link class="flex is-row" @click.native="$emit('whats-new')">
            <span class="icon">
              <span class="icon-gift"></span>
            </span>
            <span>What's New</span>
          </tap-link>
        </li>
      </ul>

      <p class="menu-label">Account</p>
      <ul class="menu-list">
        <li>
          <tap-link class="flex is-row" @click.native="$emit('user')">
            <span class="icon">
              <span class="icon-cog"></span>
            </span>
            <span>Preferences</span>
          </tap-link>
        </li>
        <li>
          <tap-link href="javascript:void(0)" class="flex is-row" @click.native="signout">
            <span class="icon">
              <span class="icon-exit"></span>
            </span>
            <span>Sign Out</span>
          </tap-link>
        </li>
      </ul>
    </aside>

    <div class="app-info">
      <small class="flex is-soft">
        <span class="flex-item">App Ver. {{ appVersion }}</span>
        <template v-if="deviceInfo">
          <span class="flex-item" v-if="deviceInfo.version">Mobile Ver. {{ deviceInfo.version }}</span>
        </template>
        <tap tag="span" class="flex-item is-aligned-right flex is-row is-center" @click.native="resync">
          <span class="flex-item">Sync&nbsp;&nbsp;</span>
          <span class="flex-item icon-sync"></span>
        </tap>
      </small>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar.vue'
import LetterCrest from '@/components/LetterCrest.vue'

export default {
  name: 'UserDrawer',

  components: {
    Avatar,
    LetterCrest
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    view () {
      return this.$route.meta.view
    },

    user () {
      return this.$store.state.auth.user
    },

    contact () {
      return this.user.virtualNumber
    },

    photoUrl () {
      return this.user.photoURL && this.user.photoURL.trim()
    },

    deviceInfo () {
      return this.$store.state.deviceInfo
    },

    appVersion () {
      return this.$store.state.appInfo.version
    }
  },

  methods: {
    resync () {
      location.reload(true)
    },

    signout () {
      this.$emitGlobal('hideUserDrawer')
      this.$store.dispatch('auth/clearAuth')
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"
@import "./index.sass"

.user-drawer
  width: 100%
  height: 100%
  position: relative
  background: $gabbi-grey-3

.drawer-close
  top: 1.25rem
  right: calc(-30px - 1.25rem)
  width: 30px
  height: 30px
  z-index: 1
  position: absolute
  .button
    width: 30px
    height: 30px
    padding: 0
    transition: all 150ms
    box-shadow: 0 $shadow-offset $shadow-blur rgba($gabbi-navy, 0.2)

.has-notch
  .drawer-close
    top: calc(1.25rem + 20px)

.user
  width: 100%
  background: $gabbi-white
  border-bottom: solid 1px $gabbi-grey-2
  .icon
    font-size: 20px

.has-notch
  .user
    padding-top: 30px

.user-avatar
  min-width: 50px
  max-width: 50px
  margin-right: $margin

.menu-label
  color: $gabbi-grey-0

.menu-list
  a
    color: $gabbi-navy
    display: flex
    border-radius: $border-radius-sm
    &.is-active
      .icon
        color: $gabbi-white
  .icon
    color: $gabbi-pink
    margin-right: $margin-sm

.checkbox
  padding: 0 !important

.app-info
  left: 0
  right: 0
  bottom: 0
  padding: $margin
  position: absolute
  > .flex > .flex-item:not(:last-child)
    margin-right: $margin
</style>
