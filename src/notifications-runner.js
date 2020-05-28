import constants from '@/constants.js'

class NotificationsRunner {
  constructor (store) {
    this.store = store
    this.runHandler = this.run.bind(this)

    this.run()
  }

  run () {
    this.update()
    setTimeout(this.runHandler, 1000/30)
  }

  update () {
    const { state, commit } = this.store
    const { notifications } = state.notifications

    const notification = notifications[0]
    if (!notification) return

    const now = Date.now()
    const next = notification.created + constants.notifications.displayDuration

    if (now > next) {
      commit('notifications/POP_NOTIFICATION')

      if (notifications.length) {
        notifications[0].created = Date.now()
      }
    }
  }
}

export default NotificationsRunner
