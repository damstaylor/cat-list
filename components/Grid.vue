<script lang="ts">
export default defineComponent({
  name: 'Grid',
  props: {
    items: { type: Array as () => any[], default: () => [] },
    limit: { type: Number, default: 9 }
  },
})
</script>

<template>
  <div class="grid" :class="'grid-template-col-' + limit">
    <GridItem v-for="(pic, idx) in items" :catData="pic" :key="idx" />
  </div>
</template>
