import Vue from 'vue'
import grandcentral from '@/api/grandcentral.js'
import extractCouchId from '@/helpers/extract-couch-id.js'
import { hasError, logError } from '@/helpers/api-error-handling.js'

const defaultListFilters = {
  tags: undefined,
  buyer: undefined,
  seller: undefined,
  tagsStyle: undefined,
  searchPrefix: undefined,
  activityMetric: undefined
}

function formatMessage (m, senders) {
  const parts = m.doc._id.split('|')
  const timestamp = Number(parts[3])

  if (m.doc.attributes.type === 'note') {
    return Object.assign(m.doc, {
      _id: m.doc._id,
      timestamp
    })
  }

  if (!m.doc.attributes.sender) {
    return Object.assign(m.doc, {
      _id: m.doc._id,
      timestamp
    })
  }

  if (m.doc.body === '<Empty Text Message Received>' || m.doc.body === '<Empty Text Message Sent>') {
    m.doc.body = ''
  }

  if (
    m.doc.attributes.sms
    && m.doc.attributes.sms[0]
    && m.doc.attributes.sms[0]._media
    && m.doc.attributes.sms[0]._media.length
  ) {
    if (m.doc.attributes.sms[0]._mediaType === undefined) {
      m.doc.hasUnknownMedia = true
    } else {
      const mediaArr = []

      m.doc.attributes.sms[0]._media.forEach((media, i) => {
        const mimeType = m.doc.attributes.sms[0]._mediaType[i]

        let mediaType = 'unknown'

        if (mimeType.includes('image')) {
          mediaType = 'image'
        }
        // else if (mimeType.includes('video')) {
        //   mediaType = 'video'
        // }
        // else if (mimeType.includes('vcard')) {
        //   mediaType = 'vcard'
        // }
        // else if (
        //   mimeType.includes('application/pdf') ||
        //   mimeType.includes('text/csv')
        // ) {
        //   mediaType = 'file'
        // }

        if (mediaType !== 'unknown') {
          mediaArr.push({
            url: media,
            type: mediaType,
            mimeType
          })
        } else {
          m.doc.hasUnknownMedia = true
        }
      })

      if (mediaArr.length) m.doc.media = mediaArr
    }
  }

  if (senders) {
    const senderId = m.doc.attributes.sender._id

    if (!senders.find(s => s.senderId === senderId)) {
      senders.push({
        agent: undefined,
        error: undefined,
        origin: m.doc.attributes.origin,
        contact: undefined,
        senderId,
        messageId: m.doc._id
      })
    }
  }

  return Object.assign(m.doc, {
    _id: m.doc._id,
    timestamp
  })
}

export default {
  namespaced: true,

  state: {
    list: undefined,
    // listPage: {
    //   skip: 0,
    //   limit: 100
    // },
    listFilters: {
      ...defaultListFilters
    },

    senders: undefined,

    messages: undefined,
    messagesPage: {
      skip: 0,
      limit: 100
    },

    readCounts: undefined,
    conversation: undefined
  },

  actions: {
    fetchList ({ rootState, state, commit }) {
      const filters = {
        ...state.listFilters,
        // ...state.listPage
      }

      return grandcentral
        .fetchConversations(rootState, rootState.auth.user.uid, filters)
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

    updateList ({ commit }, listItem) {
      commit('SET_LIST_ITEM', listItem)
    },

    removeFromList ({ commit }, listItemId) {
      commit('REMOVE_LIST_ITEM', listItemId)
    },

    fetchConversation ({ rootState, commit }, conversationId) {
      commit('REMOVE_CONVERSATION')

      return grandcentral
        .fetchConversation(rootState, conversationId)
        .then(res => {
          if (hasError(res)) {
            logError(rootState, res)
            return { error: 'Error fetching conversation.' }
          }

          commit('SET_CONVERSATION', res)

          return res
        })
        .catch(err => {
          logError(rootState, err)
          return { error: 'Error fetching conversation.' }
        })
    },

    updateConversationContact ({ commit }, updatedContact) {
      commit('SET_CONVERSATION_CONTACT', updatedContact)
    },

    sendMessage ({ rootState, commit }, { message, mediaUrl, mediaType, conversationId }) {
      const id = conversationId.includes('gb|conversation')
        ? extractCouchId(conversationId)
        : conversationId

      return grandcentral
        .sendOutboundSms(rootState, id, message, mediaUrl, mediaType)
        .then(res => {
          if (hasError(res)) {
            return logError(rootState, res)
          }

          if (mediaUrl) res.doc.attributes.sms[0]._media = [ mediaUrl ]
          const message = formatMessage(res)

          commit('ADD_MESSAGE', message)

          return message
        })
        .catch(err => {
          return logError(rootState, err)
        })
    },

    fetchMessages ({ rootState, state, commit, dispatch }, conversationId) {
      if (state.conversation && state.conversation.conversation._id !== conversationId) {
        commit('REMOVE_SENDERS')
        commit('REMOVE_MESSAGES')
      }

      const filters = {
        ...state.messagesPage
      }

      return grandcentral
        .fetchMessages(rootState, conversationId, filters)
        .then(res => {
          if (hasError(res)) {
            logError(rootState, res)
            return { error: 'Error fetching messages.' }
          }

          // Format messages to be a bit easier to work with

          const senders = []

          let messages = res.map(m => {
            return formatMessage(m, senders)
          })

          commit('SET_SENDERS', senders)

          // Fetch all the senders

          dispatch('fetchSenders')

          // Sort by date

          messages = messages.filter((m) => {
            if (m.attributes.type === 'note') return true
            else if (!m.body && (!m.hasUnknownMedia && !m.media)) return false
            return true
          }).sort((a, b) => {
            return a.timestamp - b.timestamp
          })

          const promises = []

          messages.forEach(m => {
            if (m.attributes.type === 'nudge') {
              if (m.attributes.notification.type && m.attributes.notification.type === 'reminder') {
                promises.push(new Promise((resolve, reject) => {
                  grandcentral
                    .fetchMessage(rootState, conversationId, m.attributes.notification.messageId)
                    .then((res) => {
                      m.extra = { message: res }
                      resolve()
                    })
                    .catch(err => {
                      reject(err)
                    })
                }))
              }
            }
          })

          return Promise.all(promises).then(() => {
            commit('SET_MESSAGES', messages)
            return messages
          })
        })
        .catch(err => {
          logError(rootState, err)
          return { error: 'Error fetching messages.' }
        })
    },

    fetchSenders ({ rootState, state }) {
      state.senders.forEach(s => {
        if (s.origin === 'external') {
          grandcentral
            .fetchContact(rootState, s.senderId)
            .then(res => {
              if (hasError(res)) logError(rootState, res)
              else Vue.set(s, 'contact', res)
            })
            .catch(err => {
              logError(rootState, err)
            })
        }
        else {
          grandcentral
            .fetchAgent(rootState, s.senderId)
            .then(res => {
              if (hasError(res)) logError(rootState, res)
              else Vue.set(s, 'agent', res)
            })
            .catch(err => {
              logError(rootState, err)
            })
        }
      })
    },

    fetchReadCounts ({ rootState, commit }) {
      return grandcentral
        .fetchReadCounts(rootState, rootState.auth.user.uid)
        .then(res => {
          if (hasError(res)) {
            logError(rootState, res)
            return
          }

          commit('SET_READ_COUNTS', res)
        })
        .catch(err => {
          logError(rootState, err)
        })
    },

    markAsRead ({ rootState }, conversationId) {
      return grandcentral
        .markAsRead(rootState, rootState.auth.user._id, conversationId)
        .then(res => {
          if (hasError(res)) {
            return logError(rootState, res)
          }

          return true
        })
        .catch(err => {
          return logError(rootState, err)
        })
    },

    addNoteToTimeline ({ rootState }, { conversationId, note }) {
      return grandcentral
        .addNoteToTimeline(rootState, conversationId, note)
        .then(res => {
          if (hasError(res)) {
            return logError(rootState, res)
          }

          return true
        })
        .catch(err => {
          return logError(rootState, err)
        })
    },

    setMessageNote ({ state, rootState, commit }, { conversationId, messageId, note }) {
      return grandcentral
        .setMessageNote(rootState, conversationId, messageId, note)
        .then(res => {
          if (hasError(res)) {
            console.warn('res', res)
            return logError(rootState, res)
          }

          const message = state.messages.find((m) => m._id === messageId)
          Vue.set(message.attributes, 'note', res.note)

          commit('SET_MESSAGE', message)

          return true
        })
        .catch(err => {
          console.warn('err', err)
          return logError(rootState, err)
        })
    }
  },

  mutations: {
    SET_LIST (state, list) {
      Vue.set(state, 'list', list)
    },

    SET_LIST_FILTER (state, { key, value }) {
      state.listFilters[key] = value
    },

    RESET_LIST_FILTERS (state) {
      Vue.set(state, 'listFilters', { ...defaultListFilters })
    },

    SET_LIST_ITEM (state, listItem) {
      const conversation = state.list.find(conversation => conversation.conversation._id === listItem.conversation._id)

      if (!conversation) return

      const updatedConversation = {
        contact: Object.assign(conversation.contact, listItem.contact),
        conversation: Object.assign(conversation.conversation, listItem.conversation)
      }

      const index = state.list.indexOf(conversation)
      Vue.set(state.list, index, updatedConversation)
    },

    REMOVE_LIST_ITEM (state, listItemId) {
      const index = state.list.findIndex(conversation => conversation.conversation._id === listItemId)

      if (index < 0) return

      state.list.splice(index, 1)
    },

    SET_CONVERSATION (state, conversation) {
      Vue.set(state, 'conversation', conversation)
    },

    SET_CONVERSATION_CONTACT (state, contact) {
      Vue.set(state.conversation, 'contact', contact)
    },

    REMOVE_CONVERSATION (state) {
      Vue.set(state, 'conversation', undefined)
    },

    SET_SENDERS (state, senders) {
      Vue.set(state, 'senders', senders)
    },

    REMOVE_SENDERS (state) {
      Vue.set(state, 'senders', undefined)
    },

    SET_MESSAGES (state, messages) {
      Vue.set(state, 'messages', messages)
    },

    ADD_MESSAGE (state, message) {
      state.messages.push(message)
    },

    SET_MESSAGE (state, message) {
      const index = state.messages.findIndex((m) => m._id === message._id)
      if (index === null) return

      Vue.set(state.messages, index, message)
    },

    REMOVE_MESSAGES (state) {
      Vue.set(state, 'messages', undefined)
    },

    SET_READ_COUNTS (state, readCounts) {
      Vue.set(state, 'readCounts', readCounts)
    }
  }
}
