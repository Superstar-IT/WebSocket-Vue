<template>
  <form @submit="formSubmit" @reset="formReset">
    <slot :form="formData" :errors="errors" />
  </form>
</template>

<script>
export default {
  name: 'GabbiForm',

  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  provide () {
    return {
      form: this,
      formObject: undefined,
      parentName: undefined
    }
  },

  data () {
    return {
      errors: {},
      formData: this.clone(this.value),
      initialValue: this.clone(this.value)
    }
  },

  methods: {
    submit () {
      this.$el.submit()
    },

    reset () {
      this.$el.reset()
    },

    clone (obj) {
      return JSON.parse(JSON.stringify(obj))
    },

    clean (obj) {
      for (let key in obj) {
        let nextObj = obj[key]

        const meta = nextObj.__gabbiFormObject
        if (meta) delete nextObj.__gabbiFormObject

        if (nextObj instanceof Array) {
          if (meta && !meta.allowEmpty) {
            this.$set(obj, key, nextObj.filter((item) => {
              return item !== ''
            }))
            nextObj = obj[key]
          }

          if (nextObj.length === 0) {
            this.$delete(obj, key)
          }
        } else if (nextObj instanceof Object) {
          if (meta && !meta.allowEmpty) {
            for (let key in nextObj) {
              if (nextObj[key] === '') this.$delete(nextObj, key)
            }
          }

          if (Object.keys(nextObj).length === 0) {
            this.$delete(obj, key)
          }
        }
      }

      return obj
    },

    inputs () {
      return [ ...this.$el.querySelectorAll('input, select, textarea') ]
        .map((el) => el.__gabbiInput)
        .filter((input) => input !== undefined)
    },

    validate () {
      const errors = {}

      const inputs = this.inputs()
      if (!inputs) return false

      inputs.forEach((input) => {
        let errObj = errors

        const err  = input.valid()
        const name = input.getName()

        if (!(err.empty || err.invalid)) return

        if (input.parentName) {
          if (!errObj[input.parentName]) errObj[input.parentName] = {}
          errObj = errObj[input.parentName]
        }

        errObj[name] = err
      })

      if (Object.keys(errors).length) {
        return errors
      }

      return false
    },

    formSubmit (evt) {
      if (evt) evt.preventDefault()

      const errors = this.validate()

      if (errors) {
        this.$set(this, 'errors', errors)
        this.$emit('error', errors)
        return
      }

      this.$set(this, 'errors', {})
      this.$emit('submit', this.clean(this.clone(this.formData)))
    },

    formReset (evt) {
      if (evt) evt.preventDefault()

      this.$set(this, 'errors', {})
      this.$set(this, 'formData', this.clone(this.initialValue))

      this.$emit('reset')
    },

    insert (object, key, value) {
      if (object instanceof Array) {
        if (key === undefined) object.push(value)
        else object.splice(key, 0, value)
      }
      else {
        this.$set(object, key, value)
      }
    },

    remove (object, key) {
      if (object instanceof Array) object.splice(key, 1)
      else this.$delete(object, key)
    }
  },

  watch: {
    value (newValue) {
      this.$set(this, 'initialValue', this.clone(newValue))
    }
  }
}
</script>
