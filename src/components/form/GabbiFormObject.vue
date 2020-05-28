<template>
  <div>
    <slot :parent="value" />
  </div>
</template>

<script>
export default {
  name: 'GabbiFormObject',

  inject: [
    'form'
  ],

  provide () {
    return {
      formObject: this,
      parentName: this.name || this.index
    }
  },

  data () {
    return {
      value: this.getValue()
    }
  },

  props: {
    array: {
      type: Boolean,
      default: false
    },

    name: {
      type: [ String, undefined ],
      default: undefined
    },

    index: {
      type: [ Number, undefined ],
      default: undefined
    },

    parent: {
      type: [ Object, Array ],
      default () {
        return {}
      }
    },

    errors: {
      type: [ Object, undefined ],
      default: undefined
    },

    allowEmpty: {
      type: [ Boolean, undefined ],
      default: true
    }
  },

  computed: {
    gabbiMeta () {
      return {
        allowEmpty: this.allowEmpty
      }
    }
  },

  methods: {
    push (value) {
      this.form.insert(this.value, undefined, value)
    },

    insert (key, value) {
      this.form.insert(this.value, key, value)
    },

    remove (key) {
      this.form.remove(this.value, key)
    },

    getValue () {
      let value = this.parent[this.name || this.index]

      // Has existing value
      if (value !== undefined) {
        if (!value.__gabbiFormObject && !this.array) {
          this.$set(value, '__gabbiFormObject', this.gabbiMeta)
        }

        return value
      }

      // Does not have existing value
      if (!this.array) {
        value = {}
        this.$set(value, '__gabbiFormObject', this.gabbiMeta)
      } else {
        value = []
      }

      this.$set(this.parent, this.name || this.index, value)

      return value
    }
  },

  watch: {
    parent: {
      deep: true,
      handler () {
        this.$set(this, 'value', this.getValue())
      }
    }
  }
}
</script>
