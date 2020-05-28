import constants from '@/constants.js'
import Sockette from 'sockette'
import { logError } from '@/helpers/api-error-handling.js'

export default function createWsClient (store, emit) {
  const idToken = store.state.auth.auth.idToken
  const { spaceId } = store.state.config

  let ws = null

  const pingInterval = setInterval(() => {
    if (!ws) return
    ws.send('p') // ping!
  }, constants.pingWebsocketInterval)

  function handler (update) {
    try {
      let message = JSON.parse(update.data)

      if (message.body === 'ringing') {
        emit('callStatusChanged', { status: 'connecting', conversationId: message.conversationId })
      } else if (message.body === 'in-progress') {
        emit('callStatusChanged', { status: 'in-progress', conversationId: message.conversationId })
      } else if (message.body === 'recording-complete') {
        emit('callStatusChanged', { status: 'complete', conversationId: message.conversationId })
      } else {
        emit('newMessage', message)
      }
    } catch (err) {
      logError(store.state, err)
    }
  }

  let firstConnect = true

  function reconnect (e) {
    if (firstConnect) {
      firstConnect = false
      emit('connect')
      return
    }

    console.log('Reconnected!', e)
    emit('reconnect')
  }

  function disconnect (e) {
    console.log('Offline....', e)
    emit('disconnect')
  }

  window.addEventListener('online',  reconnect)
  window.addEventListener('offline', disconnect)

  async function start () {
    try {
      ws = new Sockette(`${constants.apis.grandcentral.wsUrl}/${spaceId}/${idToken}`, {
        timeout: 5e3,
        maxAttempts: 10,
        onopen: reconnect,
        onmessage: handler,
        onreconnect: disconnect,
        onclose: e => console.warn('Closed!', e)
      })

    } catch (err) {
      logError(store.state, err)
    }
  }
  start()

  return pingInterval
}
