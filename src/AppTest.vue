<template>
  <div id="app" class="app app-test">
    <template v-if="authenticated">
      <div class="content">
        <h1 class="title is-4">About</h1>
        <p>App version: {{ $store.state.appInfo.version }}</p>
      </div>
      <div class="content">
        <h1 class="title is-4">Store Tests</h1>
        <ul>
          <li v-for="(test, i) in storeTests" :key="i">
            <span class="tag">
              <template v-if="test.result === undefined">?</template>
              <template v-if="test.result === true">✓</template>
              <template v-if="test.result === false">×</template>
            </span>
            <span>&nbsp;{{ test.action }}</span>
            <span v-if="test.err">&nbsp;{{ test.err }}</span>
          </li>
        </ul>
        <tap-button class="button is-primary" @click.native="runStoreTests">Run Store Tests</tap-button>
      </div>
      <div class="content">
        <h1 class="title is-4">Unit Tests</h1>
        <div id="mocha">
        </div>
      </div>
    </template>
    <auth-view v-else style="z-index:1" />
  </div>
</template>

<script>
import AuthView from '@/views/mobile/Auth.vue'
import AuthService from '@/auth-service.js'

// import chai from 'chai'
const Mocha = require('mocha')

export default {
  provide () {
    return {
      authService: this.authService
    }
  },

  data () {
    const authService = new AuthService(this)

    return {
      contact: undefined,
      authService,
      storeTests: [
        // Contacts
        {
          action: 'contacts/fetchList'
        },
        {
          action: 'contacts/createContact',
          payload () {
            return {
              primaryPhone: '9999990000'
            }
          },
          success (res) {
            this.$set(this, 'contact', res)
          }
        },
        {
          action: 'contacts/fetchContact',
          payload () {
            return this.contact._id
          },
          success (res) {
            this.$set(this, 'contact', res)
          }
        },
        {
          action: 'contacts/updateContact',
          payload () {
            return {
              ...this.contact,
              primaryPhone: '9999990001'
            }
          },
          success (res) {
            this.$set(this, 'contact', res)
          }
        },
        {
          action: 'contacts/deleteContact'
        }
      ]
    }
  },

  components: {
    AuthView
  },

  computed: {
    authenticated () {
      return this.$store.getters['auth/authenticated']
    }
  },

  created () {
    this.authService.authenticate()
  },

  mounted () {
    const mocha = Mocha.mocha

    mocha.setup('bdd')
    mocha.checkLeaks()
    mocha.run()
  },

  methods: {
    testAction (index = 0) {
      const test = this.storeTests[index]
      if (test === undefined) return

      this.$store
        .dispatch(test.action, test.payload && test.payload.call(this))
        .then((res) => {
          if (res.error) {
            test.err = res.error
            test.result = false
            this.testAction(index + 1)
            return
          }
          test.result = true
          if (test.success) test.success.call(this, res)
          this.testAction(index + 1)
        })
        .catch(err => {
          test.err = err.err
          test.result = false
          this.testAction(index + 1)
        })
    },

    runStoreTests () {
      this.storeTests.forEach((test) => {
        this.$set(test, 'err', undefined)
        this.$set(test, 'result', undefined)
      })
      this.testAction()
    }
  }
}
</script>

<style lang="sass">
@import "@/styles/app.sass"

.app-test
  padding: $margin-lg

ul
  margin-left: 0 !important
  list-style-type: none !important

li.progress
  float: right
</style>
