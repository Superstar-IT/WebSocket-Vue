import Vue from 'vue'
import router from '@/router.js'
import broadcast from '@/plugins/broadcast.js'
import createStore from '@/store/index.js'
import defineFilters from '@/filters.js'
import notificationsRunner from '@/notifications-runner.js'

import AppTest from '@/AppTest.vue'

// Vue setup
Vue.config.mobile = true
Vue.config.productionTip = false
Vue.use(broadcast)
defineFilters()

// Create store
const store = createStore()
new notificationsRunner(store)

// Create Vue instance
new Vue({
  router,
  store,
  render (h) {
    return h(AppTest)
  }
}).$mount('#app')
