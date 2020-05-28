export default {
  mounted () {
    const inputEl = this.$el.querySelector('input, select, textarea')
    inputEl.__gabbiInput = this
  },

  methods: {
    getName () {
      return this.name || this.index
    },

    getIndex () {
      return this.index
    }
  }
}
