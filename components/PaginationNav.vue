<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'PaginationNav',
  props: {
    currentPage: { type: Number, default: () => 0 },
    total: { type: Number, default: () => 0 },
    perPage: { type: Number, default: () => 9 }
  },
  setup(props, { emit }) {
    const getCurrentUserPage = computed(() => props.currentPage + 1);
    const getNumberOfPages = computed(() => Math.ceil(props.total / props.perPage));
    const isFirstPage = computed(() => getCurrentUserPage.value === 1);
    const isLastPage = computed(() => getCurrentUserPage.value === getNumberOfPages.value);

    const onClickPrevious = (): void => {
      emit('click-previous');
    };

    const onClickNext = (): void => {
      emit('click-next');
    };

    const onClickStart = (): void => {
      emit('click-start');
    };

    const onClickEnd = (): void => {
      emit('click-end');
    };

    const onPageNumberInput = (event: InputEvent): void => {
      if (!event) return;
      emit('page-number-input', Number((event.target as HTMLInputElement).value));
    };

    const onPerPageInput = (event: InputEvent): void => {
      if (!event) return;
      emit('per-page-input', Number((event.target as HTMLSelectElement).value));
    };

    return {
      getCurrentUserPage,
      getNumberOfPages,
      isFirstPage,
      isLastPage,
      onClickPrevious,
      onClickNext,
      onClickStart,
      onClickEnd,
      onPageNumberInput,
      onPerPageInput,
    };
  },
});
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
