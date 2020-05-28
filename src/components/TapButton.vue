<template>
  <button :type="type"><slot /></button>
</template>

<script>
export default {
  name: 'TapButton',

  props: {
    type: {
      type: String,
      default: ''
    }
  }
}
</script>
