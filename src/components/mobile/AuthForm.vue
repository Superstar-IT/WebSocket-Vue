<template>
  <div class="signin-signup">
    <div class="content">
      <gabbi-form ref="form" :value="form" @submit="submit">
        <template slot-scope="{ form }">

          <field>
            <div class="control">
              <gabbi-text-input class="auth-input" name="spaceId" v-model="form.spaceId" label="Space ID" :required="true" />
            </div>
          </field>

          <field>
            <div class="control">
              <gabbi-email-input class="auth-input" name="username" v-model="form.username" label="Email" :required="true" />
            </div>
          </field>

          <field>
            <div class="control">
              <gabbi-password-input class="auth-input" name="password" v-model="form.password" label="Password" :required="true" />
            </div>
          </field>

          <div class="field">
            <p class="control">
              <button :class="[ 'button', 'is-primary', 'is-wide', 'is-medium', signingIn && 'is-loading' ]" :disabled="signingIn">
                Sign In
              </button>
            </p>
          </div>

        </template>
      </gabbi-form>
    </div>
  </div>
</template>

<script>
import Storage from '@/helpers/storage.js'
import Field from '@/components/form/Field.vue'
import GabbiForm from '@/components/form/GabbiForm.vue'
import GabbiTextInput from '@/components/form/GabbiTextInput.vue'
import GabbiEmailInput from '@/components/form/GabbiEmailInput.vue'
import GabbiPasswordInput from '@/components/form/GabbiPasswordInput.vue'

export default {
  name: 'SigninSignup',

  inject: [ 'authService' ],

  components: {
    Field,
    GabbiForm,
    GabbiTextInput,
    GabbiEmailInput,
    GabbiPasswordInput
  },

  data () {
    return {
      form: {
        spaceId: '',
        username: '',
        password: ''
      },
      signingIn: false
    }
  },

  mounted () {
    Storage.connect().then((storage) => {
      const formData = this.$refs.form.formData

      storage.getItem('signin').then((signin) => {
        formData.spaceId = signin.spaceId
        formData.username = signin.username
      })
    })
  },

  methods: {
    reset () {
      this.$refs.form.reset()
    },

    submit (formData) {
      Storage.connect().then((storage) => {
        storage.setItem('signin', {
          'spaceId': formData.spaceId,
          'username': formData.username
        })
      })

      this.signingIn = true

      this.$store.dispatch('auth/signin', formData)
        .then((res) => {
          this.signingIn = false
          if (res.error) {
            return this.$emit('error', res.error.message)
          }
        })
    }
  }
}
</script>

<style lang="sass" scoped>
.signin-signup

.input,
.field,
.button,
.control
  width: 100%

.help
  text-align: center
</style>
