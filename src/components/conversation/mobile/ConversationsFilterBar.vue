<template>
  <app-filter-bar class="conversation-filter-bar" :active-tab="activeTab">
    <app-filter-tab @click.native="filter()">Everyone</app-filter-tab>
    <app-filter-tab @click.native="filter('buyer')">Buyers</app-filter-tab>
    <app-filter-tab @click.native="filter('seller')">Sellers</app-filter-tab>
    <!-- <template slot="content">
      <a class="sort-and-filter flex is-row">
        <span class="icon">
          <span class="icon-funnel"></span>
        </span>
        <span>Filter</span>
      </a>
    </template> -->
  </app-filter-bar>
</template>

<script>
import AppFilterBar from '@/components/mobile/AppFilterBar.vue'
import AppFilterTab from '@/components/mobile/AppFilterTab.vue'
import DropdownItem from '@/components/DropdownItem.vue'
import DropdownRadio from '@/components/DropdownRadio.vue'
import DropdownDivider from '@/components/DropdownDivider.vue'

export default {
  name: 'ConversationsFilterBar',

  components: {
    AppFilterBar,
    AppFilterTab,
    DropdownItem,
    DropdownRadio,
    DropdownDivider
  },

  computed: {
    activeTab () {
      const filters = this.$store.state.conversations.listFilters

      if (filters.seller) return 2
      if (filters.buyer) return 1
      return 0
    }
  },

  methods: {
    filter (by) {
      const filters = {
        buyer: undefined,
        seller: undefined
      }

      if (by === 'buyer') filters.buyer = true
      else if (by === 'seller') filters.seller = true

      this.$store.dispatch('conversations/setListFilters', filters)
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.conversations-filter-bar

.sort-and-filter
  height: $FILTER_BAR_HEIGHT
  line-height: $FILTER_BAR_HEIGHT
  > span.icon
    color: $gabbi-pink
    font-size: 16px
  > span:not(.icon)
    color: $gabbi-navy
</style>
