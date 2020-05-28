export default {
  props: {
    label: {
      type: String,
      default: ''
    },

    errors: {
      type: [ Object, undefined ],
      default: undefined
    },

    name: {
      type: [ String, undefined ],
      default: undefined
    },

    index: {
      type: [ Number, undefined ],
      default: undefined
    },

    value: {
      type: null,
      default: ''
    },

    required: {
      type: Boolean,
      default: false
    },

    placeholder: {
      type: String,
      default: ''
    }
  }
}
