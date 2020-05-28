let nId = 1

export default {
  namespaced: true,

  state: {
    notifications: []
  },

  actions: {
    show ({ commit, state }, payload) {
      const notification = Object.assign({
        id: nId++,
        type: 'info', // info, error, success
        created: Date.now()
      }, payload)

      // Avoid duplicate notification spam
      const lastNotification = state.notifications.length && state.notifications[state.notifications.length-1]
      if (lastNotification && lastNotification.type === notification.type && lastNotification.message === notification.message) {
        return
      }

      commit('ADD_NOTIFICATION', notification)
    },

    hide ({ commit }) {
      commit('POP_NOTIFICATION')
    }
  },

  mutations: {
    ADD_NOTIFICATION (state, payload) {
      state.notifications.push(payload)
    },

    POP_NOTIFICATION (state) {
      state.notifications.shift()
    }
  }
}
