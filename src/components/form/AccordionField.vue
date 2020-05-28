<template>
  <accordion :class="[ 'accordion-field', 'field', stacked && 'is-stacked' ]" :padding="padding" :show-initial="showInitial">
    <template slot="header">
      <label class="label">{{ label }}</label>
    </template>
    <slot />
  </accordion>
</template>

<script>
import Accordion from '@/components/Accordion.vue'

export default {
  name: 'AccordionField',

  components: {
    Accordion
  },

  props: {
    label: {
      type: [ String, undefined ],
      default: undefined
    },

    stacked: {
      type: Boolean,
      default: false
    },

    padding: {
      type: Number,
      default: 4
    },

    showInitial: {
      type: [ Boolean, undefined ],
      default: false
    }
  }
}
</script>
