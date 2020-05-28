import constants from '@/constants.js'
import { queryString, queryArr } from '@/helpers/query-string.js'

const apiUrl = constants.apis.grandcentral.url

function makeHeaders (idToken) {
  return {
    token: idToken
  }
}

export default {

  // User

  async signin (state, spaceId, username, password) {
    const body = JSON.stringify({ username, password })
    const method = 'POST'

    const response = await fetch(`${apiUrl}/login/${spaceId}`, { body, method })
    const data = await response.json()

    return data
  },

  async fetchUserProfile (state) {
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)

    const response = await fetch(`${apiUrl}/space/${spaceId}/profile`, { headers })
    const data = await response.json()

    return data
  },

  async fetchAgentProfile (state, agentId) {
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)

    const response = await fetch(`${apiUrl}/space/${spaceId}/app/marshall/agent/${agentId}/profile`, { headers })
    const data = await response.json()

    return data
  },

  async fetchAgent (state, agentId) {
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)

    const response = await fetch(`${apiUrl}/space/${spaceId}/agents/${agentId}`, { headers })
    const data = await response.json()

    return data
  },

  async registerDevice (state, deviceToken, deviceType) {
    const body = JSON.stringify({ deviceType })
    const method = 'PUT'
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)

    const response = await fetch (`${apiUrl}/space/${spaceId}/profile/device/${deviceToken}`, { body, method, headers })
    const data = await response.json()

    return data
  },

  // Contacts

  async fetchContact (state, contactId) {
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)

    const response = await fetch(`${apiUrl}/space/${spaceId}/contacts/${contactId}`, { headers })
    const data = await response.json()

    return data
  },

  async fetchContacts (state, filters = {}) {
    const query = queryString(filters)
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)

    const response = await fetch(`${apiUrl}/space/${spaceId}/contacts/q${query}`, { headers })
    const data = await response.json()

    return data
  },

  async updateContact (state, contact) {
    const body = JSON.stringify(contact)
    const method = 'PUT'
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)

    const response = await fetch(`${apiUrl}/space/${spaceId}/contacts/${contact._id}`, { body, method, headers })
    const data = await response.json()

    return data
  },

  async createContact (state, agentId, contact) {
    const body = JSON.stringify(contact)
    const method = 'POST'
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)

    const query = queryString({
      byWhom: agentId,
      ensureUniquePhone: true
    })

    const response = await fetch(`${apiUrl}/space/${spaceId}/contacts${query}`, { body, method, headers })
    const data = await response.json()

    return data
  },

  async deleteContact (state, contactId) {
    const method = 'DELETE'
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)

    const response = await fetch(`${apiUrl}/space/${spaceId}/contacts/${contactId}`, { method, headers })
    const data = await response.json()

    return data
  },

  async fetchContactsWithPhone (state, phoneNumber) {
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)

    const response = await fetch(`${apiUrl}/space/${spaceId}/contacts/phones/${phoneNumber}`, { headers })
    const data = await response.json()

    return data
  },

  // Conversations

  async fetchConversation (state, conversationId) {
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)

    const response = await fetch(`${apiUrl}/space/${spaceId}/app/marshall/conversations/${conversationId}`, { headers })
    const data = await response.json()

    return data
  },

  async fetchConversations (state, agentId, filters = {}) {
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)
    const oneMonth = 1000 * 60 * 60 * 24 * 30

    const qs = {
      ...filters,
      to: Date.now() - oneMonth,
      from: Date.now(),
      agentId
    }
    if (state.auth.user.role === 'support') delete qs.agentId

    const query = queryString(qs)

    const response = await fetch(`${apiUrl}/space/${spaceId}/app/marshall/conversations/q${query}`, { headers })
    const data = await response.json()

    return data
  },

  async fetchContactConversations (state, contactId) {
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)

    const response = await fetch(`${apiUrl}/space/${spaceId}/app/marshall/contact/${contactId}/conversations`, { headers })
    const data = await response.json()

    return data
  },

  async fetchReadCounts (state, agentId, conversationIds = []) {
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)

    const query = queryString({
      ids: queryArr(conversationIds, ',')
    })

    const response = await fetch(`${apiUrl}/space/${spaceId}/app/marshall/conversations/agent/${agentId}/read${query}`, { headers })
    const data = await response.json()

    return data
  },

  async markAsRead (state, agentId, conversationId) {
    const method = 'POST'
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)

    const response = await fetch(`${apiUrl}/space/${spaceId}/app/marshall/conversations/agent/${agentId}/read/${conversationId}`, { method, headers })
    const data = await response.json()

    return data
  },

  async createConversation (state, agentId, contactId) {
    const method = 'POST'
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)

    const response = await fetch(`${apiUrl}/space/${spaceId}/app/marshall/conversations/agent/${agentId}/client/${contactId}/conversations`, { method, headers })
    const data = await response.json()

    return data
  },

  // Messages

  async fetchMessage (state, conversationId, messageId) {
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)

    const response = await fetch(`${apiUrl}/space/${spaceId}/app/marshall/conversations/${conversationId}/messages/${messageId}`, { headers })
    const data = await response.json()

    return data
  },

  async fetchMessages (state, conversationId, filters = {}) {
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)

    const query = queryString({
      ...filters
    })

    const response = await fetch(`${apiUrl}/space/${spaceId}/app/marshall/conversations/${conversationId}/messages${query}`, { headers })
    const data = await response.json()

    return data
  },

  async sendOutboundSms (state, conversationId, message, mediaUrl, mediaType) {
    const method = 'POST'
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)

    let body = {}
    if (message) body.message = message
    if (mediaUrl) body.mediaUrl = mediaUrl
    if (mediaType) body.mediaType = mediaType
    body = JSON.stringify(body)

    const response = await fetch(`${apiUrl}/space/${spaceId}/app/marshall/conversations/${conversationId}/messages/outbound/sms`, { body, method, headers })
    const data = await response.json()

    return data
  },

  // Calls

 async sendOutboundCall (state, conversationId) {
    const method = 'POST'
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)

    const response = await fetch(`${apiUrl}/space/${spaceId}/app/marshall/conversations/${conversationId}/messages/outbound/call`, { method, headers })
    const data = await response.json()

    return data
  },

  // Integrations

  async connectNylas (state) {
    const method = 'GET'
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)

    const query = queryString({
      'redirect': location.href
    })

    const response = await fetch(`${apiUrl}/nylas/${spaceId}/connect${query}`, { method, headers })
    const data = await response.json()

    return data
  },

  async fetchEmailFile (state, conversationId, agentId, fileId, fileName) {
    const method = 'GET'
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)

    const response = await fetch(`${apiUrl}/space/${spaceId}/app/marshall/conversations/${conversationId}/emails/file/${agentId}/${fileId}/${fileName}`, { method, headers })
    // const data = await response.json()

    return response
    // return data
  },

  // File upload

  async uploadImages (state, files) {
    const method = 'POST'
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      formData.append(i, file, file.name)
    }

    const body = formData

    const response = await fetch(`${apiUrl}/space/${spaceId}/app/website/admin/images`, { method, body, headers })
    const data = await response.json()

    return data
  },

  // Logging

  async logBug (state, payload) {
    const method = 'POST'

    const body = JSON.stringify({
      when: Date.now(),
      whenForHumans: Date(),
      user: state.auth.user,
      route: window.location.href,
      idToken: state.auth.auth.idToken,
      spaceId: state.config.spaceId,
      appInfo: state.appInfo,
      deviceInfo: {
       ...(state.deviceInfo || {}),
       os: navigator.platform,
       vendor: navigator.vendor,
       downlink: navigator.connection && navigator.connection.downlink,
       language: navigator.language,
       userAgent: navigator.userAgent,
       networkType: navigator.connection && navigator.connection.effectiveType
      },
      payload
    })

    const response = await fetch(`${apiUrl}/bugs`, { method, body })
    const data = await response.json()

    return data
  },

  // Notes

  async addNoteToTimeline (state, conversationId, note) {
    const body = JSON.stringify({ ...note, truUser: state.auth.user._id })
    const method = 'POST'
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)

    const response = await fetch(`${apiUrl}/space/${spaceId}/app/marshall/conversations/${conversationId}/messages/note`, { body, method, headers })
    const data = await response.json()

    return data
  },

  async setMessageNote (state, conversationId, messageId, note) {
    const body = JSON.stringify(note)
    const query = queryString({ byWhom: state.auth.user._id })
    const method = 'PUT'
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)

    const response = await fetch(`${apiUrl}/space/${spaceId}/app/marshall/conversations/${conversationId}/messages/${messageId}/note${query}`, { body, method, headers })
    const data = await response.json()

    return data
  },

  // Nudges

  async dismissNudge (state, conversationId, messageId) {
    const method = 'PUT'
    const spaceId = state.config.spaceId
    const headers = makeHeaders(state.auth.auth.idToken)

    const response = await fetch(`${apiUrl}/space/${spaceId}/app/marshall/conversations/${conversationId}/messages/${messageId}/nudge/dismiss`, { method, headers })
    const data = await response.json()

    return data
  }
}
