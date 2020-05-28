<template>
  <div :class="[ 'input-search', 'control', 'has-icons-right', (loading && 'is-loading') ]">
    <input
      type="text"
      class="input"
      data-ignore
      autocomplete="disabled"
      v-model="value"
      :placeholder="placeholder"
    />
    <span class="icon is-right" v-if="!loading && !value">
      <span class="icon-magnifier"></span>
    </span>
    <tap tag="span" class="icon is-button is-right" v-if="!loading && value" @click.native="value = ''">
      <span class="icon-cross"></span>
    </tap>
  </div>
</template>

<script>
export default {
  name: 'InputSearch',

  props: {
    loading: {
      type: Boolean,
      default: false
    },

    placeholder: {
      type: String,
      default: 'Search'
    }
  },

  data () {
    return {
      value: '',
      debounce: null
    }
  },

  watch: {
    value (newValue) {
      this.$emit('change', newValue)

      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.$emit('search', newValue)
      }, 200)
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.input-search.control
  .icon
    color: $gabbi-grey-0
    &.is-button
      color: $gabbi-white !important
      background: rgba($gabbi-grey-0, 0.6)
      border-radius: $border-radius-x-sm
      width: 24px
      height: 24px
      margin: 6px 6px 0 0
      pointer-events: all
  &::after
    margin: 2px 2px 0 0
    border-left-color: $gabbi-grey-0
    border-bottom-color: $gabbi-grey-0

</style>
