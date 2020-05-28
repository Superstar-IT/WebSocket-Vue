<template>
  <dropdown :aligned-right="true" :aligned-up="true">
    <span class="icon-ellipsis"></span>
    <template slot="content">
      <dropdown-item @click.native="$emit('set-primary', index)">
        <a>Make Primary</a>
      </dropdown-item>
      <dropdown-item @click.native="$emit('remove', index)">
        <a>Remove</a>
      </dropdown-item>
    </template>
  </dropdown>
</template>

<script>
import Dropdown from '@/components/Dropdown.vue'
import DropdownItem from '@/components/DropdownItem.vue'
import DropdownRadio from '@/components/DropdownRadio.vue'
import DropdownDivider from '@/components/DropdownDivider.vue'

export default {
  name: 'OtherPhoneDropdown',

  components: {
    Dropdown,
    DropdownItem,
    DropdownRadio,
    DropdownDivider
  },

  props: {
    index: {
      type: Number,
      required: true
    }
  }
}
</script>
