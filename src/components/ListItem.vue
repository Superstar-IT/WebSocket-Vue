<template>
  <div v-if="isInView" :class="[ 'list-item', (small && 'is-small') ]" :style="style">
    <div class="list-item-avatar">
      <slot name="avatar" />
    </div>
    <div class="list-item-content">
      <div><slot name="top-row" /></div>
      <div><slot name="bottom-row" /></div>
    </div>
  </div>
</template>

<script>
import listItem from '@/mixins/list-item.js'

const LIST_ITEM_HEIGHT = 72
const LIST_ITEM_HEIGHT_SM = 54

export default {
  name: 'ListItem',

  mixins: [ listItem ],

  inject: [ 'listView' ],

  props: {
    small: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    height () {
      return this.small ? LIST_ITEM_HEIGHT_SM : LIST_ITEM_HEIGHT
    },

    style () {
      const { index, height, listView } = this
      const { virtual } = listView

      if (!virtual || index === undefined) return {}

      const top = index * height

      return {
        top: top + 'px',
        position: 'absolute'
      }
    },

    isInView () {
      const { index, height, listView } = this
      const { virtual, scrollTop, viewportHeight } = listView

      if (!virtual || index === undefined) return true

      const top = index * height
      const bottom = top + height

      const height2x = height * 5
      const offsetTop = (scrollTop - height2x)
      const offsetBottom = (scrollTop + viewportHeight + height2x)

      return top >= offsetTop && bottom <= offsetBottom
    }
  },

  LIST_ITEM_HEIGHT,
  LIST_ITEM_HEIGHT_SM
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.list-item
  width: 100%
  height: $LIST_ITEM_HEIGHT
  display: flex !important
  padding: $margin-fixed
  position: relative
  border-bottom: solid 1px $gabbi-grey-2
  transform-origin: 0 50%
  transition: transform $tx-duration-sm $tx-ease
  transform: scale(1)
  &:active
    transform: scale(0.985)
  &.is-small
    height: $LIST_ITEM_HEIGHT_SM
    .list-item-avatar
      min-width: $LIST_ITEM_HEIGHT_SM - ($margin-fixed * 2)
      max-width: $LIST_ITEM_HEIGHT_SM - ($margin-fixed * 2)

.list-item-avatar
  flex: 1
  height: 100%
  min-width: $LIST_ITEM_HEIGHT - ($margin-fixed * 2)
  max-width: $LIST_ITEM_HEIGHT - ($margin-fixed * 2)
  margin-right: 0.6rem
  &:empty
    display: none

.list-item-content
  flex: 1
  display: flex
  position: relative
  flex-direction: column
  justify-content: center
  > div
    width: 100%
    height: 50%
    display: flex
    position: relative
    max-height: 50%
    flex-direction: column
    justify-content: center
    &:empty
      display: none
</style>
