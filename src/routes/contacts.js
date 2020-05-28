import Contacts from '@/views/mobile/Contacts.vue'

export default [
  {
    path: '/contacts',
    name: 'contacts',
    component: Contacts,
    meta: {
      view: 'contacts',
      order: 2
    }
  },
  {
    path: '/contacts/:contactId',
    name: 'contact',
    component: Contacts,
    meta: {
      view: 'contacts',
      order: 2
    }
  }
]
