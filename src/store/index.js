import Vue from 'vue'
import Vuex from 'vuex'

import auth from '@/store/modules/auth.js'
import calls from '@/store/modules/calls.js'
import contacts from '@/store/modules/contacts.js'
import conversations from '@/store/modules/conversations.js'
import notifications from '@/store/modules/notifications.js'

const pkg = require('../../package.json')

Vue.use(Vuex)

export default function () {
  return new Vuex.Store({
    state: {
      ready: false,
      connected: false,
      dataRefreshRate: 1000 * 60 * 5, // 5 minutes
      lastDataRefresh: Date.now(),
      config: {
        source: 'idx-edm-v5',
        spaceId: undefined
      },
      appInfo: {
        version: pkg.version
      },
      deviceInfo: undefined
    },

    actions: {
      setConnected ({ commit }, payload) {
        commit('SET_CONNECTED', payload)
      },

      setDeviceInfo ({ commit }, payload) {
        commit('SET_DEVICE_INFO', payload)
      },

      setLastDataRefresh ({ commit }, payload) {
        commit('SET_LAST_DATA_REFRESH', payload)
      }
    },

    mutations: {
      IS_READY (state) {
        state.ready = true
      },

      SET_SPACE_ID (state, payload) {
        state.config.spaceId = payload
      },

      SET_CONNECTED (state, payload) {
        state.connected = payload
      },

      SET_DEVICE_INFO (state, payload) {
        Vue.set(state, 'deviceInfo', payload)
      },

      SET_LAST_DATA_REFRESH (state, payload) {
        state.lastDataRefresh = payload
      }
    },

    getters: {
      hasNotch (state) {
        if (!state.deviceInfo || !state.deviceInfo.model) return false

        const model = state.deviceInfo.model.toLowerCase()
        return model.includes('iphone10,3') || model.includes('iphone10,6') || model.includes('iphone11')
      }
    },

    modules: {
      auth,
      calls,
      contacts,
      conversations,
      notifications
    }
  })
}
