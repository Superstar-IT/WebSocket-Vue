<template>
  <message-card>
    Link: Confirmed Showing Request
    <message-card-item icon="user" action-icon="arrow-up-right">
      James Kent
    </message-card-item>
  </message-card>
</template>

<script>
import MessageCard from '@/components/conversation/MessageCard.vue'
import MessageCardItem from '@/components/conversation/MessageCardItem.vue'

export default {
  name: 'MessageLink',

  components: {
    MessageCard,
    MessageCardItem
  }
}
</script>
