<template>
  <div class="integrations">

    <integration-item
      name="Email"
      :connected="user.integrations.email && user.email"
      @connect="connectEmail"
      @disconnect="disconnectEmail"
    >
      <template slot="icon">
        <span class="icon-at-sign"></span>
      </template>
    </integration-item>

  </div>
</template>

<script>
import grandcentral from '@/api/grandcentral.js'
import IntegrationItem from '@/components/IntegrationItem.vue'

export default {
  name: 'Integrations',

  components: {
    IntegrationItem
  },

  props: {
    user: {
      type: Object,
      required: true
    }
  },

  methods: {
    connectEmail () {
      grandcentral
        .connectNylas(this.$store.state)
        .then(res => {
          if (!res.url) {
            return
          }

          location.href = res.url
        })
        .catch(err => {
          console.warn(err)
        })
    },

    disconnectEmail () {
    }
  }
}
</script>

<style lang="sass" scoped>
.integrations
  width: 100%
  position: relative
</style>
