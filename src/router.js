import Vue from 'vue'
import Router from 'vue-router'
import contacts from '@/routes/contacts.js'
import conversations from '@/routes/conversations.js'

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    ...conversations,
    ...contacts
  ]
})

export default router
