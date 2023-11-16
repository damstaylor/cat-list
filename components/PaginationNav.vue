<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "PaginationNav",
  props: {
    currentPage: { type: Number, default: () => 0 },
    total: { type: Number, default: () => 0 },
    perPage: { type: Number, default: () => 9 }
  },
  computed: {
    getCurrentUserPage(): number {
      return this.currentPage + 1;
    },
    getNumberOfPages(): number {
      return Math.ceil(this.total / this.perPage);
    },
    isFirstPage(): boolean {
      return this.getCurrentUserPage === 1;
    },
    isCurrentPage(): boolean {
      return this.getCurrentUserPage;
    },
    isLastPage(): boolean {
      return this.getCurrentUserPage === this.getNumberOfPages;
    },
  },
  methods: {
    onClickPrevious() {
      this.$emit("click-previous");
    },
    onClickNext() {
      this.$emit("click-next");
    },
    onClickStart() {
      this.$emit("click-start");
    },
    onClickEnd() {
      this.$emit("click-end");
    },
    onPageNumberInput(event: Event) {
      if (!event) return;
      this.$emit("page-number-input", Number(event.target.value));
    },
    onPerPageInput(event: KeyboardEvent) {
      if (!event) return;
      this.$emit("per-page-input", Number(event.target.value));
    },
  },
})
</script>

<template>
  <footer class="pagination-footer">
    <nav>
      <ul class="pagination">
        <li>
          <a :class="{'disabled': isFirstPage}" @click="onClickStart">«</a>
        </li>
        <li>
          <a :class="{'disabled': isFirstPage}" @click="onClickPrevious">&lt;</a>
        </li>
        <li :class="{'hidden': getNumberOfPages && getCurrentUserPage < 3}">
          <span>...</span>
        </li>
        <li :class="{'hidden': getNumberOfPages && isFirstPage}">
          <a @click="onClickPrevious">{{ getCurrentUserPage - 1 }}</a>
        </li>
        <li class="current-page-indicator">
          <a>{{ getCurrentUserPage }}</a>
        </li>
        <li :class="{'hidden': getNumberOfPages && isLastPage}">
          <a @click="onClickNext">{{ getCurrentUserPage + 1 }}</a>
        </li>
        <li :class="{'hidden': getNumberOfPages && getCurrentUserPage > getNumberOfPages - 2}">
          <span>...</span>
        </li>
        <li>
          <a :class="{'disabled': isLastPage}" @click="onClickNext">&gt;</a>
        </li>
        <li>
          <a :class="{'disabled': isLastPage}" @click="onClickEnd">»</a>
        </li>
      </ul>
      <div class="go-to-page">
        <label for="go-to-page-input">Go to page:</label>
        <input id="go-to-page-input"
               type="number"
               min=1
               :max="getNumberOfPages"
               :value="getCurrentUserPage"
               @change="onPageNumberInput"
        >
      </div>
      <div class="img-per-page">
        <label for="per-page-select">Images per page: </label>
        <select name="per-page" id="per-page-select" @input="onPerPageInput">
          <option value="4">4</option>
          <option value="9" selected>9</option>
          <option value="16">16</option>
        </select>
      </div>
    </nav>
  </footer>
</template>

<style scoped>

</style>