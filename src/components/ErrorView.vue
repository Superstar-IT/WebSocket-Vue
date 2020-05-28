<template>
  <empty-view>
    <template slot="img">
      <img src="@/assets/error@2x.png" width="90" />
    </template>
    Oops! Something went wrong.<br />
    Please try again later.
  </empty-view>
</template>

<script>
import EmptyView from '@/components/EmptyView.vue'

export default {
  name: 'ErrorView',

  components: {
    EmptyView
  }
}
</script>
