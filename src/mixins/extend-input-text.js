import InputText from '@/components/form/InputText.vue'

export default {
  components: {
    InputText
  },

  props: {
    name: {
      type: [ String, Number, undefined ],
      default: undefined
    },
    value: {
      type: String,
      default: ''
    },
    remove: {
      type: [ Function, undefined ],
      default: undefined
    },
    ignore: {
      type: Boolean,
      default: false
    },
    invalid: {
      type: [ Object, Boolean, undefined ],
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: [ String, undefined ],
      default: undefined
    }
  }
}
