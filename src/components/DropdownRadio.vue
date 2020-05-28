<template>
  <dropdown-item tag="label" class="dropdown-radio">
    <slot />
    <template slot="control">
      <span class="input-radio">
        <input type="radio" :name="name" :value="value" :checked="checked" @change="changed" />
        <span></span>
      </span>
    </template>
  </dropdown-item>
</template>

<script>
import InputRadio from '@/components/form/InputRadio.vue'
import DropdownItem from '@/components/DropdownItem.vue'

export default {
  name: 'DropdownRadio',

  components: {
    InputRadio,
    DropdownItem
  },

  props: {
    name: {
      type: String,
      default: ''
    },
    value: {
      type: null,
      default: undefined
    },
    checked: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    changed (evt) {
      if (evt.target.checked) this.$emit('change', this.value)
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"
.dropdown-radio
  .input-radio
    padding: 0.5rem
    margin-right: -0.5rem
</style>
