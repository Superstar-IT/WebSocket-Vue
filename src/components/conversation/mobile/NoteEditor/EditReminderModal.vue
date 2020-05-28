<template>
  <modal :visible="visible" @close="$emit('close')" :scroll="true" class="edit-reminder-modal" :close-button="false">
    <div class="content flex is-column">
      <h1 class="title is-5 flex-item">Edit Reminder</h1>

      <div class="field flex-item">
        <date-time-picker
          :inline="true"
          :no-shortcuts="true"
          :no-button="true"
          :no-button-now="true"
          :no-header="true"
          :only-date="true"
          :min-date="minDate"
          v-model="pickerDate"
          format="MM-DD-YYYY"
          color="#E05EAA"
          class="datepicker-container"
        />
      </div>

      <gabbi-form class="field flex-item" :value="time">
        <template slot-scope="{ form, errors }">
          <field :grouped="true">
            <gabbi-select-input name="h" label="Hour" v-model.number="time.h">
              <option v-for="(h, i) in hours" :value="h.value" :key="'hour'+i">{{ h.label }}</option>
            </gabbi-select-input>
            <gabbi-select-input name="m" label="Minute" v-model.number="time.m">
              <option v-for="(m, i) in minutes" :value="m.value" :key="'minute'+i">{{ m.label }}</option>
            </gabbi-select-input>
            <gabbi-select-input name="offset" label="AM/PM" v-model.number="time.offset">
              <option :value="0">AM</option>
              <option :value="12">PM</option>
            </gabbi-select-input>
          </field>
        </template>
      </gabbi-form>
    </div>

    <template slot="controls-left">
      <div class="field">
        <p class="control">
          <tap-button @click.native="$emit('close')" class="button is-medium is-outline is-icon">
            <span class="icon"><span class="icon-cross"></span></span>
          </tap-button>
        </p>
      </div>
    </template>

    <template slot="controls-right">
      <div class="field is-grouped">
        <p class="control">
          <tap-button @click.native="remove" class="button is-medium is-outline is-icon">
            <span class="icon"><span class="icon-alarm-error"></span></span>
            <!-- <span>Remove</span> -->
          </tap-button>
        </p>
        <p class="control">
          <tap-button @click.native="save" :class="{ 'button': true, 'is-medium': true, 'is-primary': true }">
            <span class="icon"><span class="icon-check"></span></span>
            <span>Save</span>
          </tap-button>
        </p>
      </div>
    </template>
  </modal>
</template>

<script>
import Field from '@/components/form/Field.vue'
import Modal from '@/components/mobile/Modal.vue'
import GabbiForm from '@/components/form/GabbiForm.vue'
import DateTimePicker from 'vue-ctk-date-time-picker'
import GabbiSelectInput from '@/components/form/GabbiSelectInput.vue'

export default {
  name: 'EditNoteModal',

  components: {
    Field,
    Modal,
    GabbiForm,
    DateTimePicker,
    GabbiSelectInput
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },

    currentDate: {
      type: [ Date, undefined ],
      default: undefined
    }
  },

  data () {
    return {
      date: { m: 0, d: 0, y: 2019 },
      minDate: '2019-01-01',
      time: { h: 0, m: 0, offset: 0 }
    }
  },

  created () {
    this.setNow()
  },

  computed: {
    hours () {
      const hours = []

      for (let i = 0; i < 12; i++) {
        hours.push({
          label: i + 1,
          value: Number(i + 1)
        })
      }

      return hours
    },

    minutes () {
      const interval = 5
      const numMinutes = 60 / interval

      const minutes = []

      for (let i = 0; i < numMinutes; i++) {
        let value = Number(i * interval)
        let label = value < 10 ? ('0'+value) : value

        minutes.push({
          label,
          value
        })
      }

      return minutes
    },

    pickerDate: {
      get () {
        let month = this.date.m
        if (month < 10) month = '0' + month

        let day = this.date.d
        if (day < 10) day = '0' + day

        const year = this.date.y

        return `${month}-${day}-${year}`
      },

      set (value) {
        const parts = value.split('-')

        this.$set(this, 'date', {
          m: Number(parts[0]),
          d: Number(parts[1]),
          y: Number(parts[2])
        })
      }
    }
  },

  methods: {
    save () {
      const date = new Date()
      date.setSeconds(0)
      date.setMinutes(this.time.m)
      date.setHours(this.time.h + this.time.offset)
      date.setDate(this.date.d)
      date.setMonth(this.date.m-1)
      date.setFullYear(this.date.y)

      if (date.getTime() <= Date.now()) {
        this.$store.dispatch('notifications/show', { type: 'error', message: "Reminder can't be in the past." })
        return
      }

      this.$emit('save', date)
      this.$emit('close')
    },

    remove () {
      this.$emit('save', false)
      this.$emit('close')
    },

    setNow () {
      const d = this.currentDate || new Date()

      // Date

      let month = d.getMonth()+1
      let day = d.getDate()
      const year = d.getFullYear()

      this.$set(this, 'date', {
        m: month,
        d: day,
        y: year
      })

      if (month < 10) month = '0' + month
      if (day < 10) day = '0' + day

      this.minDate = `${year}-${month}-${day}`

      // Time

      const minutes = Math.floor((d.getMinutes() + 5) / 5) * 5

      this.time.h = (d.getHours() % 12) + (minutes === 60 ? 1 : 0)
      this.time.m = minutes === 60 ? 0 : minutes
      this.time.offset = d.getHours() > 12 ? 12 : 0
    }
  },

  watch: {
    visible (isVisible) {
      if (isVisible) this.setNow()
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"
</style>
