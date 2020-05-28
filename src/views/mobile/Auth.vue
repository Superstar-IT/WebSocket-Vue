<template>
  <div class="app-view auth-view">
    <div class="auth-view-inner">
      <div class="auth-form">
        <div class="auth-logo flex is-column is-centered">
          <div class="flex-item">
            <img src="@/assets/logo-white@2x.png" />
          </div>
        </div>
        <div class="auth-welcome">
          <h1 class="title is-3">Good {{ timeOfDay }}</h1>
          <p class="subtitle">Please sign in or <tap-link href="https://www.gabbi.ai/" :external="true">sign up</tap-link>.</p>
        </div>
        <div class="auth-form-inner">
          <auth-form @error="errorMessage = $event" ref="form" />
        </div>
      </div>
    </div>

    <modal :visible="errorMessage !== undefined" :close-button="false">
      <div class="content">
        <h1 class="title is-5">Oops!</h1>
        <template v-if="errorMessage !== undefined">
          <p>
            Either the email or password you entered is incorrect.
          </p>
        </template>
      </div>
      <template slot="controls-right">
        <div class="field">
          <p class="control">
            <tap-button class="button is-medium is-primary" @click.native="resetForm">
              <span>Try Again</span>
            </tap-button>
          </p>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import Modal from '@/components/mobile/Modal.vue'
import AuthForm from '@/components/mobile/AuthForm.vue'

export default {
  name: 'AuthView',

  inject: [
    'baseUrl'
  ],

  components: {
    Modal,
    AuthForm
  },

  data () {
    return {
      errorMessage: undefined
    }
  },

  computed: {
    timeOfDay () {
      const date = new Date()
      const hour = date.getHours()

      if (hour >= 0 && hour < 12) {
        return 'Morning'
      } else if (hour >= 12 && hour < 18) {
        return 'Afternoon'
      } else if (hour >= 18 && hour <= 23) {
        return 'Evening'
      }
    }
  },

  methods: {
    tap () {
      console.log('tap')
    },

    resetForm () {
      this.errorMessage = undefined
      this.$refs.form.reset()
    },

    openLink (evt) {
      evt.preventDefault()
      window.open('https://www.gabbi.ai/', '_blank')
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.auth-view
  padding: $margin-lg $margin-lg 0 $margin-lg
  position: relative
  background: $gabbi-pink linear-gradient(360deg, rgba($gabbi-navy, 0.5), $gabbi-pink, $gabbi-pink)

.auth-view-inner
  width: 100%
  height: 100%
  position: relative

.auth-logo
  padding: $margin-lg
  text-align: center
  small
    color: $gabbi-white
    display: inline-block
    margin-top: 0.5rem
  img
    width: 20vh
    max-width: 150px
    margin: auto
    display: block

.auth-welcome
  text-align: center
  margin-top: $margin-lg
  margin-bottom: $margin-lg
  a
    color: $gabbi-white
    text-decoration: underline
  .title,
  .subtitle
    color: $gabbi-white
  .subtitle
    font-size: $font-size-lg

.auth-form
  position: absolute
  left: 0
  bottom: 0
  right: 0

.auth-form-inner
  padding: $margin-lg
  background: $gabbi-white
  box-shadow: 0 $shadow-offset-lg $shadow-blur-lg rgba($gabbi-navy, 0.25)
  border-radius: $border-radius-lg $border-radius-lg 0 0
</style>
