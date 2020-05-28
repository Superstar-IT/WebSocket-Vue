import Vue from 'vue'
import grandcentral from '@/api/grandcentral.js'
import { hasError, logError } from '@/helpers/api-error-handling.js'

export default {
  namespaced: true,

  state: {
    call: undefined,
    showCall: false
  },

  actions: {
    start ({ commit, rootState }, payload) {
      const id = payload.id.replace('gb|conversation|', '')
      const displayName = payload.displayName

      grandcentral
        .sendOutboundCall(rootState, id)
        .then(res => {
          if (hasError(res)) {
            return logError(rootState, res)
          }

          commit('SET_CALL', { status: 'connecting', id, displayName })
          commit('SHOW_CALL', true)
        })
        .catch(err => {
          return logError(rootState, err)
        })
    },

    end ({ commit }) {
      commit('CLEAR_CALL')
      commit('SHOW_CALL', false)
    },

    setStatus ({ commit }, payload) {
      if (payload === 'complete') {
        commit('CLEAR_CALL')
      } else {
        commit('SET_STATUS', payload)
      }
    },

    toggleShow ({ state, commit }) {
      console.log('toggle Calling')
      commit('SHOW_CALL', !state.showCall)
    }
  },

  mutations: {
    SHOW_CALL (state, payload) {
      state.showCall = payload
    },

    SET_CALL (state, payload) {
      Vue.set(state, 'call', payload)
    },

    SET_STATUS (state, payload) {
      Vue.set(state.call, 'status', payload)
    },

    CLEAR_CALL (state) {
      Vue.set(state, 'call', undefined)
    },
  }
}
