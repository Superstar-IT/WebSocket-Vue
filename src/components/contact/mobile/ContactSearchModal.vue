<template>
  <search-modal
    placeholder="Search by name"
    :error="error"
    :empty="contacts.length === 0"
    :loading="loading"
    :visible="visible"
    @visible="fetchContacts"
    @change="loading = true"
    @search="search"
    @close="$emit('close')"
  >
    <template slot="title">{{ title }}</template>
    <template slot="list">
      <new-list-item
        v-if="createNew"
        :index="0"
        @click.native="$emit('new-contact')"
      />
      <small-list-item
        v-for="(contact, i) in contacts"
        class="list-item"
        :key="contact._id"
        :index="i + (createNew ? 1 : 0)"
        :contact="contact"
        @click.native="$emit('contact', contact._id)"
      />
    </template>
  </search-modal>
</template>

<script>
import grandcentral from '@/api/grandcentral.js'
import { hasError, logError } from '@/helpers/api-error-handling.js'

import SearchModal from '@/components/mobile/SearchModal.vue'
import NewListItem from '@/components/contact/NewListItem.vue'
import SmallListItem from '@/components/contact/SmallListItem.vue'

export default {
  name: 'NewConversationModal',

  components: {
    SearchModal,
    NewListItem,
    SmallListItem
  },

  props: {
    title: {
      type: String,
      default: 'Contacts'
    },

    visible: {
      type: Boolean,
      default: false
    },

    createNew: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      error: false,
      loading: true,
      contacts: []
    }
  },

  mounted () {
    this.fetchContacts()
  },

  methods: {
    search (value) {
      this.fetchContacts(value)
    },

    fetchContacts (searchPrefix) {
      this.loading = true
      this.contacts = []

      const filters = {
        sort: 'last',
        skip: 0,
        limit: 100,
        sortOrder: 'asc',
        searchPrefix
      }
      if (!filters.searchPrefix) delete filters.searchPrefix

      grandcentral
        .fetchContacts(this.$store.state, filters)
        .then(res => {
          this.loading = false

          if (hasError(res)) {
            logError(this.$store.state, res)
            this.$set(this, 'error', res)
          }

          if (res.rows) {
            this.$set(this, 'contacts', res.rows)
          } else {
            logError(this.$store.state, res)
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
