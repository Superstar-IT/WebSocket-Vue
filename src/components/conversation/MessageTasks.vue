<template>
  <message-card type="card">
    <message-card-task :checked="true">
      <div>Lorem ipsum dolor sit amet.</div>
      <div>Lorem ipsum dolor sit amet.</div>
    </message-card-task>
    <hr />
    <message-card-task :checked="false" :urgent="true">
      <div>Lorem ipsum dolor sit amet.</div>
      <div>Lorem ipsum dolor sit amet.</div>
    </message-card-task>
  </message-card>
</template>

<script>
import MessageCard from '@/components/conversation/MessageCard.vue'
import MessageCardTask from '@/components/conversation/MessageCardTask.vue'

export default {
  name: 'MessageTasks',

  components: {
    MessageCard,
    MessageCardTask
  }
}
</script>
