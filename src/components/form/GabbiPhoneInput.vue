<template>
  <gabbi-input :parent-props="$props" :input="input" :valid="valid" :invalid-message="invalidMessage">
    <input
      ref="input"
      type="tel"
      autocomplete="disabled"
      :class="[ 'input', errors && 'is-danger', $slots.default && 'has-icon' ]"
      :value="formattedValue"
      :style="{ paddingLeft }"
      :placeholder="placeholder"
      @input="input"
      @paste="paste"
    />
    <label class="country-code">
      +{{ countryCode }}
      <select ref="countryCodeSelect" v-model="countryCode">
        <option :value="code.code" v-for="(code, i) in callingCodes" :key="'code'+i">
          {{ code.country }} (+{{ code.code }})
        </option>
      </select>
    </label>
    <div class="input-icon">
      <slot />
    </div>
  </gabbi-input>
</template>

<script>
import callingCodes from '@/helpers/calling-codes.js'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import GabbiInput from '@/components/form/GabbiInput.vue'
import gabbiInputProps from '@/mixins/gabbi-input-props.js'

export default {
  name: 'GabbiPhoneInput',

  mixins: [
    gabbiInputProps
  ],

  components: {
    GabbiInput
  },

  data () {
    return {
      phoneNumber: '',
      countryCode: '',
      paddingLeft: `calc(1.5rem)`
    }
  },

  created () {
    this.splitValues()
  },

  mounted () {
    this.resizeInput()
  },

  computed: {
    callingCodes () {
      return callingCodes
    },

    invalidMessage () {
      return 'Invalid phone number.'
    },

    formattedValue () {
      const value = this.value
      const strippedValue = value.replace(/[^\d]/g, '').replace('+', '').slice(this.countryCode.length)

      try {
        const phoneNumber = parsePhoneNumberFromString(value, 'US')

        if (!phoneNumber.isValid() || phoneNumber.nationalNumber.length < 10) {
          return strippedValue
        }

        return phoneNumber.formatNational()
      } catch (e) {
        return strippedValue
      }
    }
  },

  methods: {
    splitValues () {
      const value = this.value

      try {
        const phoneNumber = parsePhoneNumberFromString(value, 'US')

        this.countryCode = phoneNumber.countryCallingCode
        this.phoneNumber = phoneNumber.nationalNumber
      } catch (e) {
        this.countryCode = '1'
        this.phoneNumber = value.replace(/[^\d]/g, '')
      }
    },

    resizeInput () {
      const countryCodeSelect = this.$refs.countryCodeSelect
      const rect = countryCodeSelect.getBoundingClientRect()
      const width = rect.width

      this.paddingLeft = `calc(1.25em + ${width}px)`
    },

    input () {
      const el = this.$refs.input
      const value = el.value.trim().replace(/[^\d]/g, '')
      const countryCode = '+' + this.countryCode

      this.$emit('input', countryCode + value)

      return value
    },

    valid () {
      const el = this.$refs.input
      const value = el.value.trim().replace(/[^\d]/g, '')

      const empty = this.required && value === ''

      const regex = /\d{10,10}/g
      const invalid = value !== '' && (value.match(regex) === null || value.length > 10)

      return {
        empty,
        invalid
      }
    },

    paste () {
      this.$nextTick(() => {
        const el = this.$refs.input
        el.value = this.input()
      })
    }
  },

  watch: {
    value () {
      this.splitValues()
    },

    countryCode () {
      this.$nextTick(() => {
        this.resizeInput()
      })
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.input
  &.has-icon
    padding-right: calc(0.75em + #{$icon-size})

.country-code
  display: block
  position: relative
  left: 1rem
  bottom: calc(0.75rem - 1px)
  z-index: 1
  position: absolute
  line-height: calc((40px - 0.375rem) - (0.75rem))
  padding: 0 0.375rem
  border: none
  font-size: 14px
  font-family: 'Source Sans Pro'
  appearance: none
  color: $gabbi-navy
  background: $gabbi-grey-1
  cursor: pointer
  border-radius: 7px
  select
    top: 0
    left: 0
    opacity: 0
    max-width: 100%
    position: absolute

.input-icon
  position: absolute
  right: 0.75em
  bottom: calc(0.375em + 1px)
</style>
