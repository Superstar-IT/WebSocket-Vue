<template>
  <modal :visible="visible" :tall="true" @close="$emit('close')">
    <div class="content">
      <div class="panel flex is-column">

        <h1 class="flex-item title is-5">
          <slot name="title">Search</slot>
        </h1>

        <div class="flex-item panel-search">
          <input-search
            :loading="loading"
            :placeholder="placeholder"
            @change="$emit('change', $event)"
            @search="$emit('search', $event)"
          />
        </div>

        <div class="flex-item panel-list">
          <div v-if="error" class="panel flex is-centered">
            <error-view />
          </div>
          <div v-else-if="loading" class="panel loading flex is-centered">
            <div class="flex-item"></div>
          </div>
          <div v-else-if="empty" class="panel flex is-centered">
            No results found.
          </div>
          <list-view v-else class="list-view" :itemHeight="itemHeight" :margin="75">
            <slot name="list" />
          </list-view>
        </div>

      </div>
    </div>
  </modal>
</template>

<script>
import Modal from '@/components/mobile/Modal.vue'
import ListItem from '@/components/ListItem.vue'
import ListView from '@/components/ListView.vue'
import ErrorView from '@/components/ErrorView.vue'
import InputSearch from '@/components/form/InputSearch.vue'

export default {
  name: 'SearchModal',

  components: {
    Modal,
    ListView,
    ErrorView,
    InputSearch
  },

  props: {
    error: {
      error: Boolean,
      default: false
    },

    empty: {
      type: Boolean,
      default: false
    },

    loading: {
      type: Boolean,
      default: false
    },

    visible: {
      type: Boolean,
      default: false
    },

    placeholder: {
      type: String,
      default: 'Search'
    }
  },

  computed: {
    itemHeight () {
      return ListItem.LIST_ITEM_HEIGHT_SM
    }
  },

  watch: {
    // visible (visible) {
    //   if (visible) {
    //     this.$emit('visible')
    //   }
    // }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/mixins.sass"
@import "@/styles/variables.sass"

.content
  width: 100%
  height: 100%
  position: relative
  pointer-events: none

.panel
  flex: 1
  width: 100%
  height: 100%

.panel-search
  min-height: 40px
  max-height: 40px
  pointer-events: auto
  margin-bottom: $margin-lg

.panel-list
  flex: 1
  pointer-events: auto
  margin-left: -$margin-lg
  margin-right: -$margin-lg
  position: relative
  border-top: solid 1px $gabbi-grey-2

.list-view
  position: absolute
  background: $gabbi-grey-3

.loading
  .flex-item
    width: 70px
    height: 70px
    +loader

</style>
