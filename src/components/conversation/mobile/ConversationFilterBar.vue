<template>
  <app-filter-bar class="conversation-filter-bar" :active-tab="activeTab">
    <app-filter-tab @click.native="filter()">Everything</app-filter-tab>
    <app-filter-tab ref="notes" @click.native="filter('notes')" data-index="1">Just Notes</app-filter-tab>
  </app-filter-bar>
</template>

<script>
import AppFilterBar from '@/components/mobile/AppFilterBar.vue'
import AppFilterTab from '@/components/mobile/AppFilterTab.vue'
import DropdownItem from '@/components/DropdownItem.vue'
import DropdownRadio from '@/components/DropdownRadio.vue'
import DropdownDivider from '@/components/DropdownDivider.vue'

export default {
  name: 'ConversationFilterBar',

  components: {
    AppFilterBar,
    AppFilterTab,
    DropdownItem,
    DropdownRadio,
    DropdownDivider
  },

  props: {
    filters: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      currentFilter: ''
    }
  },

  computed: {
    activeTab () {
      if (!this.currentFilter) return 0

      return Number(this.$refs.notes.$el.dataset.index)
    }
  },

  methods: {
    filter (by) {
      const filters = { ...this.filters }

      this.currentFilter = by

      if (by) {
        for (let key in filters) {
          if (key === by) filters[key] = true
          else filters[key] = false
        }
      } else {
        for (let key in filters) {
          filters[key] = true
        }
      }

      this.$emit('filters-changed', filters)
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.conversation-filter-bar

.sort-and-filter
  height: $FILTER_BAR_HEIGHT
  line-height: $FILTER_BAR_HEIGHT
  > span.icon
    color: $gabbi-pink
    font-size: 16px
  > span:not(.icon)
    color: $gabbi-navy
</style>
