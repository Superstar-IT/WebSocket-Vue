import Vue from 'vue'
import Storage from '@/helpers/storage.js'
import grandcentral from '@/api/grandcentral.js'
import { hasError, logError } from '@/helpers/api-error-handling.js'

export default {
  namespaced: true,

  state: {
    auth: undefined,
    user: undefined
  },

  actions: {
    signin ({ rootState, commit, dispatch }, { spaceId, username, password }) {
      spaceId = spaceId.trim().toLowerCase()
      username = username.trim()

      return grandcentral.signin(rootState, spaceId, username, password)
        .then((res) => {
          if (hasError(res)) {
            return logError(rootState, res)
          }

          Vue.set(rootState.config, 'spaceId', spaceId)

          Storage.connect().then((storage) => {
            storage.setItem('auth', {
              spaceId,
              user: res.profile,
              idToken: res.id_token,
              expiresAt: Number.MAX_VALUE
            })
          })

          commit('SET_AUTH', { idToken: res.id_token, expiresAt: Number.MAX_VALUE })
          commit('SET_USER', res.profile)

          if (rootState.deviceInfo) {
            dispatch('registerDevice')
          }

          return true
        })
        .catch((err) => {
          return logError(rootState, err)
        })
    },

    clearAuth ({ commit }) {
      Storage.connect().then((storage) => {
        storage.setItem('auth', {
          spaceId: '',
          user: '',
          idToken: '',
          expiresAt: ''
        }).then(() => {
          commit('CLEAR_AUTH')
        })
      })
    },

    registerDevice ({ rootState }) {
      const { platform, deviceToken } = rootState.deviceInfo

      if (deviceToken !== null) {
        grandcentral
          .registerDevice(rootState, deviceToken, platform)
          .then(res => {
            if (hasError(res)) {
              return logError(rootState, res)
            }

            console.log('Device registered.', res)
          })
          .catch(err => {
            logError(rootState, err)
          })
      }
    },

    fetchProfile ({ rootState, commit, dispatch }) {
      let user

      return grandcentral
        .fetchUserProfile(rootState)
        .then(res => {
          if (hasError(res)) {
            console.log('error', res)
            dispatch('clearAuth')
            return logError(rootState, res)
          }

          user = res

          return grandcentral
            .fetchAgentProfile(rootState, res.uid)
            .then(res => {
              if (hasError(res)) {
                console.log('error', res)
                dispatch('clearAuth')
                return logError(rootState, res)
              }

              user = {
                ...user,
                integrations: {
                  email: res.email
                },
                virtualNumber: res.phone,
              }

              Storage.connect().then((storage) => {
                storage.getItem('auth').then((auth) => {
                  storage.setItem('auth', {
                    ...auth,
                    user
                  })
                })
              })

              commit('SET_USER', user)

              if (rootState.deviceInfo) {
                dispatch('registerDevice')
              }

              return user
            })
            .catch(err => {
              console.log('error', err)
              dispatch('clearAuth')
              return logError(rootState, err)
            })
        })
        .catch(err => {
          console.log('error', err)
          dispatch('clearAuth')
          return logError(rootState, err)
        })
    }
  },

  mutations: {
    SET_AUTH (state, payload) {
      Vue.set(state, 'auth', payload)
    },

    CLEAR_AUTH (state) {
      Vue.set(state, 'auth', undefined)
      Vue.set(state, 'user', undefined)
    },

    SET_USER (state, payload) {
      Vue.set(state, 'user', payload)
    }
  },

  getters: {
    authenticated (state) {
      return state.auth !== undefined && state.user !== undefined
    }
  }
}
