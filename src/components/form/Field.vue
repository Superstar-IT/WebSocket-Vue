<template>
  <div :class="{ 'field': true, 'is-grouped': grouped }">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Field',

  props: {
    grouped: {
      type: Boolean,
      default: false
    }
  }
}
</script>
