import Conversations from '@/views/mobile/Conversations.vue'

export default [
  {
    path: '/',
    name: 'home',
    component: Conversations,
    meta: {
      view: 'conversations',
      order: 1
    }
  },
  {
    path: '/conversations',
    name: 'conversations',
    component: Conversations,
    meta: {
      view: 'conversations',
      order: 1
    }
  },
  {
    path: '/conversations/:conversationId',
    name: 'conversation',
    component: Conversations,
    meta: {
      view: 'conversations',
      order: 1
    }
  }
]
