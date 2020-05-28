import AuthService from '@/auth-service.js'
import createWsClient from '@/ws-client.js'

export default {
  provide () {
    return {
      authService: this.authService
    }
  },

  data () {
    const authService = new AuthService(this)

    return {
      ready: false,
      authService
    }
  },

  computed: {
    authenticated () {
      return this.$store.getters['auth/authenticated']
    }
  },

  created () {
    const result = this.authService.authenticate()

    const fetchInitialData = () => {
      createWsClient(this.$store, this.$emitGlobal)

      this.$store.dispatch('contacts/fetchList')
      this.$store.dispatch('conversations/fetchList')
    }

    if (result === true) {
      this.ready = true
      fetchInitialData()
    } else {
      result
        .then(() => {
          this.ready = true
          fetchInitialData()
        })
        .catch(() => {
          this.ready = true
        })
    }
  }
}
