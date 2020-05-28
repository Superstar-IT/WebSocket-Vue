import Vue from 'vue'
import animeta from 'vue-animeta'
import StackTrace from 'stacktrace-js'

import tapComponent from '@/components/Tap.vue'
import tapLinkComponent from '@/components/TapLink.vue'
import tapButtonComponent from '@/components/TapButton.vue'

import router from '@/router.js'
import broadcast from '@/plugins/broadcast.js'
import gabbiAscii from '@/gabbi-ascii.js'
import createStore from '@/store/index.js'
import grandcentral from '@/api/grandcentral.js'
import defineFilters from '@/filters.js'
import notificationsRunner from '@/notifications-runner.js'

import AppMobile from '@/AppMobile.vue'

/*
* Vue app initialization
*/

function initApp (store, storage, cordova, device) {
  let plugins

  /* eslint-disable */
  if (cordova) {
    plugins = {
      Camera,
      Keyboard,
      StatusBar,
      PushNotification
    }
  } else {
    plugins = {
      Camera: false,
      Keyboard: false,
      StatusBar: false,
      PushNotification: false
    }
  }
  /* eslint-enable */

  new Vue({
    router,
    store,

    provide () {
      return {
        device,
        cordova,
        storage,
        baseUrl: process.env.BASE_URL,
        ...plugins
      }
    },

    data () {
      return {
        handlers: {}
      }
    },

    render (h) {
      return h(AppMobile)
    },

    mounted () {
      // Developer greeting
      console.log(gabbiAscii, 'color:#E05EAA')
    },

    created () {
      // Redirect to proper route if Cordova app
      if (this.$route.path.includes('Gabbi.app')) {
        this.$router.replace({ path: '/conversations' })
      }

      this.handlers.resume = (evt) => {
        this.$emitGlobal('resume', evt)
      }
      document.addEventListener('resume', this.handlers.resume)

      this.handlers.backButton = (evt) => {
        evt.preventDefault()
        this.$emitGlobal('backButton', evt)
      }
      document.addEventListener('backbutton', this.handlers.backButton)

      if (process.env.NODE_ENV === 'development') return

      // Global error monitoring
      Vue.config.errorHandler = () => {
        StackTrace.get()
        .then((frames) => {
          const stack = frames.splice(1)
          grandcentral.logBug(this.$store.state, {
            vueError: true, stack
          })
        })
        .catch((stErr) => {
          console.warn(stErr)
        })
        return true
      }
    },

    beforeDestroy () {
      document.removeEventListener('resume', this.handlers.resume)
      document.removeEventListener('backbutton', this.handlers.backButton)
    }
  }).$mount('#app')
}

/*
* Cordova app initialization
*/

function initCordova (store) {
  // Device info

  const deviceInfo = {}
  deviceInfo.model = device.model // eslint-disable-line
  deviceInfo.platform = device.platform.toLowerCase() // eslint-disable-line
  deviceInfo.platformVersion = device.version // eslint-disable-line

  store.dispatch('setDeviceInfo', deviceInfo)

  // Plugins

  /* eslint-disable */
  window.open = function (url, name, specs) {
    if (deviceInfo.platform === 'ios') url = encodeURI(url)
    cordova.InAppBrowser.open(url, name, specs)
  }

  if (Keyboard) {
    Keyboard.automaticScrollToTopOnHiding = true
  }
  /* eslint-enable */

  if (deviceInfo.platform !== 'ios' && deviceInfo.platform !== 'android') {
    return
  }

  // App version

  cordova.getAppVersion.getVersionNumber().then((version) => { // eslint-disable-line
    console.log('get version')

    const deviceInfo = { ...store.state.deviceInfo }
    deviceInfo.version = version

    store.dispatch('setDeviceInfo', deviceInfo)
  })

  // Push notifications

  const push = PushNotification.init({ // eslint-disable-line
    ios: {
      alert: 'true',
      badge: 'true',
      sound: 'true'
    },
    android: {
      icon: 'notification_ic',
      vibrate: true,
      senderID: 1004304006659,
      iconColor: '#E05EAA',
      forceShow: true
    },
    browser: {
      pushServiceURL: 'http://push.api.phonegap.com/v1/push'
    },
    windows: {}
  })

  // Register
  push.on('registration', (evt) => {
    console.log('Device token:', evt.registrationId)

    const deviceInfo = { ...store.state.deviceInfo }
    deviceInfo.deviceToken = evt.registrationId

    store.dispatch('setDeviceInfo', deviceInfo)
  })

  // On notification
  push.on('notification', (evt) => {
    const navigateTo = (data) => {
      const url = '/' + data.routeId + '/' + data.conversationId

      console.log('Navigate to:', url)
      this.$router.push({ path: url })
    }

    if (evt.additionalData && evt.additionalData.foreground) {
      cordova.plugins.notification.local.schedule({ // eslint-disable-line
        text: evt.message,
        title: evt.title,
        foreground: true,
        additionalData: evt.additionalData
      })

      cordova.plugins.notification.local.on('click', () => { // eslint-disable-line
        if (evt.additionalData) {
          navigateTo(evt.additionalData)
        }
      }, evt)
    } else if (evt.additionalData) {
      navigateTo(evt.additionalData)
    }
  })

  // On error
  push.on('error', (err) => {
    console.warn('Error', err)
    // TODO: push notification error
  })
}

/*
* Initialization
*/

// Vue setup: config
Vue.config.mobile = true
Vue.config.productionTip = false

// Vue setup: plugins, components, filters
Vue.use(broadcast)
Vue.component('Tap', tapComponent)
Vue.component('TapLink', tapLinkComponent)
Vue.component('TapButton', tapButtonComponent)
for (let key in animeta) Vue.component(key, animeta[key])
defineFilters()

// Create store
const store = createStore()

// Create in-app notifications
// TODO: move to app.js mixin
new notificationsRunner(store)

// Initialization
if (typeof cordova !== 'undefined') { // eslint-disable-line
  document.addEventListener('deviceready', () => {
    console.log('Device ready.')

    initApp(store, cordova, device) // eslint-disable-line
    initCordova(store, router)
  })
} else {
  initApp(store)
}
