<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'Grid',
  props : {
    pictures: { type: Array, default: () => [] },
    limit: { type: Number, default: () => 9 },
  },
})
</script>

<template>
  <div class="pictures" :class="'grid-template-col-' + limit">
    <GridItem v-for="(pic, idx) in pictures" :catData="pic" :key=idx />
  </div>
</template>

<style scoped>

</style>