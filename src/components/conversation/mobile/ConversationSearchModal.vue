<template>
  <search-modal
    placeholder="Search by name"
    :error="error"
    :empty="conversations.length === 0"
    :loading="loading"
    :visible="visible"
    @visible="fetchConversations"
    @change="loading = true"
    @search="search"
    @close="$emit('close')"
  >
    <template slot="title">Find a Conversation</template>
    <template slot="list">
      <small-list-item
        v-for="(root, i) in conversations"
        class="list-item"
        :key="root.conversation._id"
        :index="i"
        :root="root"
        @click.native="$emit('contact', root.conversation._id)"
      />
    </template>
  </search-modal>
</template>

<script>
import grandcentral from '@/api/grandcentral.js'
import { hasError, logError } from '@/helpers/api-error-handling.js'

import SearchModal from '@/components/mobile/SearchModal.vue'
import SmallListItem from '@/components/conversation/SmallListItem.vue'

export default {
  name: 'NewConversationModal',

  components: {
    SearchModal,
    SmallListItem
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      error: false,
      loading: true,
      conversations: []
    }
  },

  mounted () {
    this.fetchConversations()
  },

  methods: {
    search (value) {
      this.fetchConversations(value)
    },

    fetchConversations (searchPrefix) {
      this.loading = true
      this.contacts = []

      const filters = {}

      if (searchPrefix) {
        filters.searchPrefix = searchPrefix
      } else {
        const oneMonth = 1000 * 60 * 60 * 24 * 30
        filters.to = Date.now() - oneMonth,
        filters.from = Date.now()
      }

      const agentId = this.$store.state.auth.user.uid

      grandcentral
        .fetchConversations(this.$store.state, agentId, filters)
        .then(res => {
          this.loading = false

          if (hasError(res)) {
            logError(this.$store.state, res)
            this.$set(this, 'error', res)
          }

          if (res.rows) {
            this.$set(this, 'conversations', res.rows)
          } else {
            logError(res)
            this.$set(this, 'error', res)
          }
        })
        .catch(err => {
          this.loading = false

          logError(this.$store.state, err)
          this.$set(this, 'error', err)
        })
    }
  }
}
</script>
