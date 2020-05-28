<template>
  <message-card type="card" title="Showings">
    <message-card-item class="card-item" icon="clock3">
      <div><strong>Tuesday, June 12</strong></div>
      <div>Trying for after 6:00 PM</div>
      <template slot="status"><span class="is-soft">XX:XX XX</span></template>
    </message-card-item>
    <message-card-item class="card-item" icon="home5" action-icon="plus">
      <div>100 10234 159 ST NW</div>
      <div>Edmonton, AB</div>
    </message-card-item>
    <hr />
    <message-card-item class="card-item" icon="clock3">
      <div><strong>Tuesday, June 12</strong></div>
      <div>Trying for after 6:00 PM</div>
      <template slot="status"><span class="is-soft">XX:XX XX</span></template>
    </message-card-item>
    <message-card-item class="card-item" icon="home5" action-icon="plus">
      <div>100 10234 159 ST NW</div>
      <div>Edmonton, AB</div>
    </message-card-item>
  </message-card>
</template>

<script>
import MessageCard from '@/components/conversation/MessageCard.vue'
import MessageCardItem from '@/components/conversation/MessageCardItem.vue'

export default {
  name: 'MessageShowings',

  components: {
    MessageCard,
    MessageCardItem
  }
}
</script>
