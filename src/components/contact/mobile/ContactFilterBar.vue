<template>
  <app-filter-bar class="contact-filter-bar" :active-tab="activeTab">
    <app-filter-tab @click.native="filter()">Everyone</app-filter-tab>
    <app-filter-tab @click.native="filter('buyer')">Buyers</app-filter-tab>
    <app-filter-tab @click.native="filter('seller')">Sellers</app-filter-tab>
    <template slot="content">
      <dropdown :aligned-right="true">
        <a class="sort-and-filter flex is-row">
          <span class="icon">
            <span class="icon-funnel"></span>
          </span>
          <span>Filter &amp; Sort</span>
        </a>
        <template slot="content">
          <dropdown-radio name="sortOpts" :checked="checked('last', 'asc')" :value="{ sort: 'last', sortOrder: 'asc' }" @change="sortOpts = $event">A to Z</dropdown-radio>
          <dropdown-radio name="sortOpts" :checked="checked('last', 'desc')" :value="{ sort: 'last', sortOrder: 'desc' }" @change="sortOpts = $event">Z to A</dropdown-radio>
          <!-- <dropdown-divider />
          <dropdown-item style="text-align:center">
            <a class="link">Manage Filters</a>
          </dropdown-item> -->
        </template>
      </dropdown>
    </template>
  </app-filter-bar>
</template>

<script>
import Dropdown from '@/components/Dropdown.vue'
import DropdownItem from '@/components/DropdownItem.vue'
import DropdownRadio from '@/components/DropdownRadio.vue'
import DropdownDivider from '@/components/DropdownDivider.vue'
import AppFilterBar from '@/components/mobile/AppFilterBar.vue'
import AppFilterTab from '@/components/mobile/AppFilterTab.vue'

export default {
  name: 'ContactFilterBar',

  components: {
    Dropdown,
    DropdownItem,
    DropdownRadio,
    DropdownDivider,
    AppFilterBar,
    AppFilterTab
  },

  computed: {
    sortOpts: {
      get () {
        return this.$store.state.contacts.listSort
      },
      set (opts) {
        this.$store.dispatch('contacts/setListSort', opts)
      }
    },

    activeTab () {
      const filters = this.$store.state.contacts.listFilters

      if (filters.seller) return 2
      if (filters.buyer) return 1
      return 0
    }
  },

  methods: {
    checked (sort, sortOrder) {
      const { sortOpts } = this
      return sort === sortOpts.sort && sortOrder === sortOpts.sortOrder
    },

    filter (by) {
      const filters = {
        buyer: undefined,
        seller: undefined
      }

      if (by === 'buyer') filters.buyer = true
      else if (by === 'seller') filters.seller = true

      this.$store.dispatch('contacts/setListFilters', filters)
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.contact-filter-bar

.sort-and-filter
  height: $FILTER_BAR_HEIGHT
  line-height: $FILTER_BAR_HEIGHT
  > span.icon
    color: $gabbi-pink
    font-size: 16px
  > span:not(.icon)
    color: $gabbi-navy
</style>
