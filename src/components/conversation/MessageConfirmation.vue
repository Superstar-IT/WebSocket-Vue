<template>
  <message type="action">
    <template slot="actions">
      <message-actions>
        <button class="button is-outline is-icon">
          <span class="icon">
            <span class="icon-ellipsis"></span>
          </span>
        </button>
        <button class="button is-primary">
          Send It
        </button>
        <button class="button is-primary is-icon">
          <span class="icon">
            <span class="icon-pencil-line"></span>
          </span>
        </button>
      </message-actions>
    </template>
  </message>
</template>

<script>
import Message from '@/components/conversation/Message.vue'
import MessageActions from '@/components/conversation/MessageActions.vue'

export default {
  name: 'MessageLink',

  components: {
    Message,
    MessageActions
  }
}
</script>
