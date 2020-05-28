import grandcentral from '@/api/grandcentral.js'
import { hasError, logError } from '@/helpers/api-error-handling.js'

export default function (contactId, onSuccess, onError) {
  const { $store } = this

  // Fetch a list of existing conversations for that contact
  // and find the most recent one to continue from

  grandcentral
    .fetchContactConversations($store.state, contactId)
    .then(res => {

      // Error fetching list of contact conversations

      if (hasError(res)) {
        if (onError) onError('Error creating conversation.')
        logError($store.state, res)

        return
      }

      // Filter out conversations I don't belong to

      res = res.filter((c) => c.truRealtor === $store.state.auth.user.uid)

      // No conversation exists, so create a new one

      if (!res.length) {
        grandcentral
          .createConversation($store.state, $store.state.auth.user.uid, contactId)
          .then(res => {

            // Error creating new conversation

            if (hasError(res)) {
              if (onError) onError('Error creating conversation.')
              logError($store.state, res)

              return
            }

            if (onSuccess) onSuccess(res.conversation)
          })

          // Error creating conversation

          .catch(err => {
            if (onError) onError('Error creating conversation.')
            logError($store.state, err)
          })
        return
      }

      // Conversation exists, find latest and change the route

      res.sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp)
      const conversation = res[0]
      if (onSuccess) onSuccess(conversation)
    })

    // Error fetching list of contact conversations

    .catch(err => {
      if (onError) onError('Error creating conversation.')
      logError($store.state, err)
    })
}
