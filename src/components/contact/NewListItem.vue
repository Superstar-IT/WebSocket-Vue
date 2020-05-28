<template>
  <list-item class="contact-list-item" :small="true" :index="index">

    <template slot="top-row">
      <span class="new-contact flex is-row">
        <span class="icon flex is-centered">
          <span class="icon-plus"></span>
        </span>
        <span>New Contact</span>
      </span>
    </template>

  </list-item>
</template>

<script>
import ListItem from '@/components/ListItem.vue'
import listItem from '@/mixins/list-item.js'

export default {
  name: 'ContactNewListItem',

  mixins: [ listItem ],

  components: {
    ListItem
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.contact-list-item
  background-color: $gabbi-grey-3

.new-contact
  font-size: $font-size-sm
  .icon
    color: $gabbi-white
    width: 34px
    height: 34px
    background: $gabbi-pink
    margin-right: $margin
    border-radius: $border-radius-sm
    box-shadow: 0 $shadow-offset-sm $shadow-blur-sm $shadow-pink
    font-size: 16px
</style>
