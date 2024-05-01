<script lang="ts">
import { defineComponent } from 'vue';
import GridItem from './GridItem.vue';
export default defineComponent({
  name: 'Grid',
  components: { GridItem },
  props: {
    pictures: { type: Array as () => any[], default: () => [] },
    limit: { type: Number, default: 9 }
  },
})
</script>

<template>
  <div class="grid" :class="'grid-template-col-' + limit">
    <GridItem v-for="(pic, idx) in pictures" :catData="pic" :key="idx" />
  </div>
</template>
