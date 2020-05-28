<template>
  <div :class="`email-message is-${type}`">
    <p class="flex is-row subject">
      <span class="flex-item icon email-icon">
        <span class="icon-envelope-open"></span>
      </span>
      <strong class="flex-item">{{ email.subject }}</strong>
    </p>
    <p>
      {{ message.body }}
    </p>
    <p v-if="email.files.length && !fileError">
      <small class="is-soft">Attachments</small>
    </p>
    <ul v-if="email.files.length && !fileError" class="file-list">
      <li v-for="file in files" :key="file.id" class="file flex is-row">
        <tap-link v-if="file.url" :href="file.url" :external="true" class="flex-item link">{{ file.filename }}</tap-link>
        <a v-else class="flex-item link is-soft">{{ file.filename }}</a>

        <small v-if="file.url" class="flex-item is-aligned-right is-soft">{{ fileSize(file) }}</small>
        <span v-else class="flex-item loading is-aligned-right"></span>
      </li>
    </ul>
    <p v-if="fileError">
      <small class="is-soft">There was a problem loading attachments.</small>
    </p>
  </div>
</template>

<script>
import grandcentral from '@/api/grandcentral.js'

export default {
  props: {
    type: {
      type: String,
      default: 'contact' // contact, agent
    },

    message: {
      type: Object,
      required: true
    },

    conversationId: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      files: {},
      fileError: undefined
    }
  },

  computed: {
    email () {
      return this.message.attributes.email
    }
  },

  created () {
    this.email.files.forEach((file) => {
      this.loadFile(file)
    })
  },

  methods: {
    fileSize (file) {
      const kibs = file.size / 1024

      return kibs >= 1024
        ? ((kibs / 1024).toFixed(1) + ' MB')
        : (kibs.toFixed(1) + ' kB')
    },

    loadFile (file) {
      const { conversationId } = this
      const { id, agentId, filename } = file

      this.$set(this.files, id, {
        ...file,
        loading: true
      })

      grandcentral
        .fetchEmailFile(this.$store.state, conversationId, agentId, id, filename)
        .then(res => {
          if (!res.url) {
            this.$set(this, 'fileError', res)
            return
          }

          this.$set(this.files, id, {
            ...file,
            url: res.url + '?token=' + this.$store.state.auth.auth.idToken
          })
        })
        .catch(err => {
          console.warn(err)
          this.$set(this, 'fileError', err)
        })
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/mixins.sass"
@import "@/styles/variables.sass"

.email-message
  position: relative
  border-left: solid 3px $gabbi-grey-2
  padding-left: $margin
  margin-bottom: $margin
  p
    margin-bottom: $margin-sm
    &:last-child
      margin-bottom: 0
  &.is-agent
    color: #fff
    border-left: solid 3px rgba(#fff, 0.2)
    a,
    small,
    strong
      color: #fff !important
    .email-icon
      opacity: 0.6
  &.is-contact
    .email-icon
      color: $gabbi-grey-0

.email-icon
  margin-right: 0.25rem

.file-list
  margin-top: $margin-sm

.file
  margin-bottom: $margin-sm
  a
    transition: all $tx-duration

.subject
  max-width: 100%
  position: relative
  strong
    max-width: 100%
    display: inline-block
    overflow: hidden
    position: relative
    white-space: nowrap
    text-overflow: ellipsis

.loading
  width: 14px
  height: 14px
  margin-right: 0.25rem
  +loader
</style>
