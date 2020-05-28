import Vue from 'vue'
import grandcentral from '@/api/grandcentral.js'
import { hasError, logError } from '@/helpers/api-error-handling.js'

const defaultListFilters = {
  tags: undefined,
  buyer: undefined,
  seller: undefined,
  tagsStyle: undefined,
  searchPrefix: undefined,
  activityMetric: undefined
}

export default {
  namespaced: true,

  state: {
    list: undefined,
    listPage: {
      skip: 0,
      limit: 100
    },
    listSort: {
      sort: 'last',
      sortOrder: 'asc'
    },
    listFilters: {
      ...defaultListFilters
    },

    contact: undefined
  },

  actions: {
    fetchList ({ rootState, state, commit }) {
      const filters = {
        ...state.listFilters,
        ...state.listSort,
        ...state.listPage
      }

      return grandcentral
        .fetchContacts(rootState, filters)
        .then(res => {
          if (hasError(res)) {
            return logError(rootState, res)
          }

          if (res.rows) {
            commit('SET_LIST', res.rows)
            return res.rows
          } else {
            return logError(rootState, res)
          }
        })
        .catch(err => {
          return logError(rootState, err)
        })
    },

    setListSort ({ commit, dispatch }, sortOpts) {
      commit('SET_LIST', undefined)
      commit('SET_LIST_SORT', sortOpts)

      return dispatch('fetchList')
    },

    setListFilters ({ commit, dispatch }, filters) {
      commit('SET_LIST', undefined)

      for (let key in filters) {
        const value = filters[key]
        commit('SET_LIST_FILTER', { key, value })
      }

      return dispatch('fetchList')
    },

    resetListFilters ({ commit, dispatch }) {
      commit('RESET_LIST_FILTERS')

      return dispatch('fetchList')
    },

    fetchContact ({ rootState, commit }, contactId) {
      commit('REMOVE_CONTACT')

      return grandcentral
        .fetchContact(rootState, contactId)
        .then(res => {
          if (hasError(res)) {
            return logError(rootState, res)
          }

          commit('SET_CONTACT', res)

          return res
        })
        .catch(err => {
          return logError(rootState, err)
        })
    },

    updateContact ({ rootState, commit }, updatedContact) {
      if (!updatedContact.primaryPhone) {
        return { error: 'Contact cannot be missing a primary phone number.' }
      }

      return grandcentral
        .fetchContactsWithPhone(rootState, updatedContact.primaryPhone)
        .then((res) => {
          if (hasError(res)) {
            logError(rootState, res)
            return { error: 'Error checking for duplicate phone numbers.' }
          }

          if (res.length !== 0) {
            const sameContact = res.find(c => c._id === updatedContact._id)
            if (!sameContact) {
              return { error: 'A contact with this phone number already exists.' }
            }
          }

          return grandcentral
            .updateContact(rootState, updatedContact)
            .then(res => {
              if (hasError(res)) {
                logError(rootState, res)
                return { error: 'Error updating contact.' }
              }

              const contact = Object.assign(updatedContact, {
                _id: res.id,
                _rev: res.rev
              })

              commit('SET_CONTACT', contact)
              commit('SET_LIST_ITEM', contact)

              return contact
            })
            .catch(err => {
              logError(rootState, err)
              return { error: 'Error updating contact.' }
            })
        })
        .catch((err) => {
          logError(rootState, err)
          return { error: 'Error checking for duplicate phone numbers.' }
        })
    },

    createContact ({ state, rootState, commit }, newContact) {
      return grandcentral
        .createContact(rootState, rootState.auth.user.uid, newContact)
        .then(res => {
          if (hasError(res)) {
            return logError(rootState, res)
          }

          const contact = Object.assign(newContact, {
            _id: res.id,
            _rev: res.rev
          })

          commit('SET_CONTACT', contact)
          if (state.list) commit('ADD_LIST_ITEM', contact)

          return contact
        })
        .catch(err => {
          return logError(rootState, err)
        })
    },

    deleteContact ({ state, rootState, commit }) {
      if (!state.contact) return { error: 'No contact to delete.' }

      const contactId = state.contact._id

      return grandcentral
        .deleteContact(rootState, contactId)
        .then(res => {
          if (hasError(res)) {
            return logError(rootState, res)
          }

          commit('REMOVE_CONTACT', contactId)
          if (state.list) commit('REMOVE_LIST_ITEM', contactId)

          return contactId
        })
        .catch(err => {
          return logError(rootState, err)
        })
    }
  },

  mutations: {
    SET_LIST (state, list) {
      Vue.set(state, 'list', list)
    },

    SET_LIST_SORT (state, { sort, sortOrder }) {
      state.listSort.sort = sort
      state.listSort.sortOrder = sortOrder
    },

    SET_LIST_FILTER (state, { key, value }) {
      state.listFilters[key] = value
    },

    RESET_LIST_FILTERS (state) {
      Vue.set(state, 'listFilters', { ...defaultListFilters })
    },

    SET_LIST_ITEM (state, listItem) {
      const contact = state.list.find(contact => contact._id === listItem._id)
      const updatedContact = Object.assign(contact, listItem)

      const index = state.list.indexOf(contact)
      Vue.set(state.list, index, updatedContact)
    },

    ADD_LIST_ITEM (state, listItem) {
      state.list.unshift(listItem)
    },

    REMOVE_LIST_ITEM (state, listItemId) {
      const index = state.list.findIndex(contact => contact._id === listItemId)
      state.list.splice(index, 1)
    },

    SET_CONTACT (state, contact) {
      Vue.set(state, 'contact', contact)
    },

    REMOVE_CONTACT (state) {
      Vue.set(state, 'contact', undefined)
    }
  }
}
