<template>
  <message-card type="action" title="Confirm Showings">
    <message-card-item class="card-item" icon="clock3">
      <div><strong>Tuesday, June 12</strong></div>
      <div>Trying for after 6:00 PM</div>
      <template slot="status"><span class="is-soft">XX:XX XX</span></template>
    </message-card-item>
    <message-card-item class="card-item" icon="home5" action-icon="pencil-line">
      <div>100 10234 159 ST NW</div>
      <div>Edmonton, AB</div>
    </message-card-item>
    <hr />
    <message-card-item class="card-item" icon="clock3">
      <div><strong>Tuesday, June 12</strong></div>
      <div>Trying for after 6:00 PM</div>
      <template slot="status"><span class="is-soft">XX:XX XX</span></template>
    </message-card-item>
    <message-card-item class="card-item" icon="home5" action-icon="pencil-line">
      <div>100 10234 159 ST NW</div>
      <div>Edmonton, AB</div>
    </message-card-item>
    <template slot="actions">
      <message-actions>
        <button class="button is-outline is-icon">
          <span class="icon">
            <span class="icon-ellipsis"></span>
          </span>
        </button>
        <button class="button is-primary">
          Let Me See
        </button>
      </message-actions>
    </template>
  </message-card>
</template>

<script>
import MessageCard from '@/components/conversation/MessageCard.vue'
import MessageActions from '@/components/conversation/MessageActions.vue'
import MessageCardItem from '@/components/conversation/MessageCardItem.vue'

export default {
  name: 'MessageShowingsConfirmation',

  components: {
    MessageCard,
    MessageActions,
    MessageCardItem
  }
}
</script>
