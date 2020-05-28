import constants from '@/constants.js'

export default {
  methods: {
    delayIfUnready (callback) {
      const { state, commit } = this.$store

      if (!state.ready) {
        commit('IS_READY')
        setTimeout(() => { callback() }, constants.initialCallDelay)
      } else {
        callback()
      }
    }
  }
}
