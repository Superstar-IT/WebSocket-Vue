<template>
  <list-item class="contact-list-item" :small="true" :index="index">

    <!-- Avatar -->

    <template slot="avatar">
      <avatar v-if="contact.avatar" :small="true" />
      <letter-crest v-else :seed="contact._id" :small="true" :display-name="contact | displayName" />
    </template>

    <!-- Top row -->

    <template slot="top-row">
      <div class="flex is-row is-wide is-spaced-sm">

        <!-- Name/number/email -->

        <div class="flex is-row flex-item" style="flex-shrink:0">
          <small class="flex-item">{{ contact | displayName }}</small>
        </div>

      </div>
    </template>

    <!-- Bottom row -->

    <template slot="bottom-row">
      <div class="flex is-row is-wide" v-if="contact.primaryPhone || contact.email">

        <!-- Phone number -->

        <div class="flex is-row flex-item" style="flex-shrink:0">
          <small class="flex-item is-soft no-wrap contact-preview">
            <template v-if="contact.primaryPhone">{{ contact.primaryPhone | phoneNumber }}</template>
            <template v-else-if="contact.email">{{ contact.email }}</template>
          </small>
        </div>

      </div>
    </template>

  </list-item>
</template>

<script>
import Avatar from '@/components/Avatar.vue'
import ListItem from '@/components/ListItem.vue'
import listItem from '@/mixins/list-item.js'
import LetterCrest from '@/components/LetterCrest.vue'

export default {
  name: 'ContactSmallListItem',

  mixins: [ listItem ],

  components: {
    Avatar,
    ListItem,
    LetterCrest
  },

  props: {
    contact: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.contact-list-item
  background-color: $gabbi-grey-3

.tag:not(body)
  height: 1rem
  padding: 0 0.5rem
  font-size: 11px
  &.is-contact
    color: $gabbi-grey-0
    border: solid 1px $gabbi-grey-1
    background: transparent
    text-transform: uppercase
    letter-spacing: 1px

.contact-preview
  max-width: 290px

</style>
