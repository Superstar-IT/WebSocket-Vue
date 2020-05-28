<template>
  <gabbi-form ref="form" :value="contact" @submit="formSubmit" @error="formError">
    <template slot-scope="{ form, errors }">

      <!-- Name -->

      <field :grouped="true">
        <gabbi-text-input label="First name" name="first" v-model="form.first" :required="true" />
        <gabbi-text-input label="Last name" name="last" v-model="form.last" />
      </field>

      <!-- Primary phone number -->

      <field>
        <gabbi-phone-input label="Primary phone" name="primaryPhone" v-model="primaryPhone" :required="true" />
      </field>

      <!-- Email -->

      <field>
        <gabbi-email-input label="Email" name="email" v-model="form.email" />
      </field>

      <!-- Buyer / seller status -->

      <field>
        <gabbi-select-input name="buyerSeller" label="Buyer/Seller status" v-model="buyerSeller">
          <option :value="JSON.stringify({ buyer: false, seller: false })">None</option>
          <option :value="JSON.stringify({ buyer: true, seller: false })">Buyer</option>
          <option :value="JSON.stringify({ buyer: false, seller: true })">Seller</option>
          <option :value="JSON.stringify({ buyer: true, seller: true })">Buyer &amp; Seller</option>
        </gabbi-select-input>
      </field>

      <template v-if="!basic">

        <!-- Home address -->

        <accordion-field label="Home Address">
          <gabbi-form-object name="homeAddress" :errors="errors.homeAddress" :parent="form" :allow-empty="false">
            <template slot-scope="{ parent }">
              <field>
                <gabbi-text-input name="line1" label="Line 1" v-model="parent.line1" />
              </field>
              <field>
                <gabbi-text-input name="line2" label="Line 2" v-model="parent.line2" />
              </field>
              <field :grouped="true">
                <gabbi-text-input name="postal" label="Zip/Postal Code" v-model="parent.postal" />
                <gabbi-text-input name="city" label="City" v-model="parent.city" />
              </field>
              <field :grouped="true">
                <gabbi-text-input name="state" label="State/Province" v-model="parent.state" />
                <gabbi-text-input name="country" label="Country" v-model="parent.country" />
              </field>
            </template>
          </gabbi-form-object>
        </accordion-field>

        <!-- Work address -->

        <accordion-field label="Work Address">
          <gabbi-form-object name="workAddress" :errors="errors.workAddress" :parent="form" :allow-empty="false">
            <template slot-scope="{ parent }">
              <field>
                <gabbi-text-input name="line1" label="Line 1" v-model="parent.line1" />
              </field>
              <field>
                <gabbi-text-input name="line2" label="Line 2" v-model="parent.line2" />
              </field>
              <field :grouped="true">
                <gabbi-text-input name="postal" label="Zip/Postal Code" v-model="parent.postal" />
                <gabbi-text-input name="city" label="City" v-model="parent.city" />
              </field>
              <field :grouped="true">
                <gabbi-text-input name="state" label="State/Province" v-model="parent.state" />
                <gabbi-text-input name="country" label="Country" v-model="parent.country" />
              </field>
            </template>
          </gabbi-form-object>
        </accordion-field>

        <!-- Birthday -->

        <accordion-field label="Birthday">
          <gabbi-form-object name="birthday" :errors="errors.birthday">
            <template slot-scope="{ parent }">
              <field :grouped="true">
                <gabbi-select-input name="month" label="Month" v-model="birthday.month">
                  <option :value="0" disabled></option>
                  <option v-for="(month, i) in months" :value="i+1" :key="'month'+i">{{ month.name }}</option>
                </gabbi-select-input>
                <gabbi-select-input name="day" label="Day" v-model="birthday.day">
                  <option :value="0" disabled></option>
                  <option v-if="birthday.month" v-for="(day, i) in days" :value="i+1" :key="'day'+i">{{ i+1 }}</option>
                </gabbi-select-input>
                <gabbi-select-input name="year" label="Year" v-model="birthday.year">
                  <option :value="0" disabled></option>
                  <option v-for="(year, i) in years" :value="year" :key="'year'+i">{{ year }}</option>
                </gabbi-select-input>
              </field>
            </template>
          </gabbi-form-object>
        </accordion-field>

        <!-- Additional phone numbers -->

        <accordion-field label="Additional Phone Numbers" :show-initial="otherPhones !== undefined && otherPhones.length > 0">
          <gabbi-form-object name="otherPhones" :errors="errors.otherPhones" :array="true">
            <template>
              <field v-for="(number, i) in otherPhones" :key="'otherPhone'+i">
                <gabbi-phone-input label="Phone number" :index="i" v-model="otherPhones[i]" :required="true">
                  <other-phone-dropdown :index="i" @set-primary="setAsPrimaryPhone(i)" @remove="removeOtherPhone(i)" />
                </gabbi-phone-input>
              </field>
              <field>
                <icon-link icon="plus" @click.native="addOtherPhone">Add a phone number</icon-link>
              </field>
            </template>
          </gabbi-form-object>
        </accordion-field>

        <!-- Additional emails -->

        <accordion-field label="Additional Emails" :show-initial="form.otherEmails !== undefined && form.otherEmails.length > 0">
          <gabbi-form-object name="otherEmails" :errors="errors.otherEmails" :parent="form" :array="true">
            <template slot-scope="{ parent }">
              <field v-for="(email, i) in parent" :key="'otherEmail'+i">
                <gabbi-email-input label="Email" :index="i" v-model="email.email" :required="true">
                  <other-phone-dropdown :index="i" @set-primary="setAsPrimaryEmail(i)" @remove="removeOtherEmail(i)" />
                </gabbi-email-input>
              </field>
              <field>
                <icon-link icon="plus" @click.native="addOtherEmail">Add an email</icon-link>
              </field>
            </template>
          </gabbi-form-object>
        </accordion-field>

        <br />

      </template>

      <slot />

    </template>
  </gabbi-form>
</template>

<script>
import months from '@/helpers/months.js'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

import Field from '@/components/form/Field.vue'
import AccordionField from '@/components/form/AccordionField.vue'
import OtherPhoneDropdown from '@/components/contact/OtherPhoneDropdown.vue'
import IconLink from '@/components/form/IconLink.vue'
import GabbiForm from '@/components/form/GabbiForm.vue'
import GabbiTextInput from '@/components/form/GabbiTextInput.vue'
import GabbiPhoneInput from '@/components/form/GabbiPhoneInput.vue'
import GabbiEmailInput from '@/components/form/GabbiEmailInput.vue'
import GabbiFormObject from '@/components/form/GabbiFormObject.vue'
import GabbiSelectInput from '@/components/form/GabbiSelectInput.vue'

export default {
  name: 'ContactForm',

  components: {
    Field,
    AccordionField,
    OtherPhoneDropdown,
    IconLink,
    GabbiForm,
    GabbiTextInput,
    GabbiPhoneInput,
    GabbiEmailInput,
    GabbiFormObject,
    GabbiSelectInput
  },

  props: {
    basic: {
      type: Boolean,
      default: false
    },

    contact: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  data () {
    return {
      curPhoneMenu: undefined,
      birthday: {
        day: 0,
        year: 0,
        month: 0
      },
      buyerSeller: '{ buyer: false, seller: false }',
      primaryPhone: '',
      otherPhones: []
    }
  },

  computed: {
    days () {
      const { month } = this.birthday

      if (!month) return []

      const days = []
      days.length = months[month-1].days

      return days
    },

    months () {
      return months
    },

    years () {
      const curYear = (new Date()).getFullYear()

      const years = []
      for (let i = curYear - 100; i < curYear; i++) {
        years.push(i)
      }

      return years
    },

    showPhoneMenu: {
      get () {
        return this.curPhoneMenu
      },

      set (value) {
        if (value === this.curPhoneMenu) {
          this.curPhoneMenu = undefined
          return
        }

        this.curPhoneMenu = value
      }
    }
  },

  created () {
    this.setInitialBirthday()
    this.setInitialOtherPhones()
    this.setInitialPrimaryPhone()
    this.setInitialBuyerSeller()
  },

  methods: {
    submit () {
      this.$refs.form.formSubmit()
    },

    formSubmit (data) {
      this.$emit('submit', data)
    },

    formError (errors) {
      this.$emit('errors', errors)
    },

    addOtherEmail () {
      const formData = this.$refs.form.formData
      if (!formData.otherEmails) this.$set(formData, 'otherEmails', [])

      formData.otherEmails.push({ email: '' })
    },

    removeOtherEmail (index) {
      const formData = this.$refs.form.formData
      formData.otherEmails.splice(index, 1)
    },

    setAsPrimaryEmail(index) {
      const formData = this.$refs.form.formData

      const email = formData.otherEmails[index].email
      const primaryEmail = formData.email

      this.$set(formData.otherEmails[index], 'email', primaryEmail)
      this.$set(formData, 'email', email)
    },

    addOtherPhone () {
      this.otherPhones.push('')
    },

    removeOtherPhone (index) {
      this.otherPhones.splice(index, 1)
    },

    setAsPrimaryPhone (index) {
      const phoneNumber = this.otherPhones[index]
      const primaryPhone = this.primaryPhone

      this.$set(this.otherPhones, index, primaryPhone)
      this.$set(this, 'primaryPhone', phoneNumber)
    },

    parsePhoneNumber (value) {
      let countryCode
      let phoneNumber

      try {
        const parsedNumber = parsePhoneNumberFromString(value, 'US')

        countryCode = parsedNumber.countryCallingCode
        phoneNumber = parsedNumber.nationalNumber
      } catch (e) {
        countryCode = '1'
        phoneNumber = value.replace(/[^\d]/g, '')
      }

      return { countryCode, phoneNumber }
    },

    setInitialBirthday () {
      if (this.contact.birthday) {
        const { day, month, year } = this.contact.birthday
        this.$set(this, 'birthday', { day, month, year })
      }
    },

    setInitialOtherPhones () {
      if (!this.contact.otherPhones || !this.contact.otherPhones.length) return

      const phoneNumbers = this.contact.otherPhones.map((val) => {
        const countryCode = val.countryCode || '1'
        const phoneNumber = val.phone

        return `+${countryCode}${phoneNumber}`
      })

      this.$set(this, 'otherPhones', phoneNumbers)
    },

    setInitialPrimaryPhone () {
      const countryCode = this.contact.primaryPhoneCountryCode || '1'
      const phoneNumber = this.contact.primaryPhone

      this.primaryPhone = `+${countryCode}${phoneNumber}`
    },

    setInitialBuyerSeller () {
      const buyerSeller = {
        buyer: this.contact.buyer,
        seller: this.contact.seller
      }

      this.$set(this, 'buyerSeller', JSON.stringify(buyerSeller))
    }
  },

  watch: {
    birthday: {
      deep: true,
      handler (value) {
        if (!this.$refs.form) return

        const formData = this.$refs.form.formData

        if (!value.day || !value.year || !value.month) {
          this.$delete(formData, 'birthday')
          return
        }

        this.$set(formData, 'birthday', value)
      }
    },

    primaryPhone (value) {
      if (!this.$refs.form) return

      const formData = this.$refs.form.formData
      const { phoneNumber, countryCode } = this.parsePhoneNumber(value)

      formData.primaryPhone = phoneNumber
      formData.primaryPhoneCountryCode = countryCode
    },

    otherPhones: {
      deep: true,
      handler (value) {
        if (!this.$refs.form) return

        const formData = this.$refs.form.formData

        if (!value.length) {
          this.$delete(formData, 'otherPhones')
          return
        }

        const phoneNumbers = value.map((val) => {
          const { phoneNumber, countryCode } = this.parsePhoneNumber(val)

          return {
            phone: phoneNumber,
            countryCode: countryCode,
            mode: 'integrated-conversation'
          }
        })

        this.$set(formData, 'otherPhones', phoneNumbers)
      }
    },

    buyerSeller (value) {
      if (!this.$refs.form) return

      const formData = this.$refs.form.formData

      value = JSON.parse(value)
      Object.keys(value).forEach((key) => {
        const status = value[key]
        this.$set(formData, key, status)
      })
    }
  }
}
</script>
