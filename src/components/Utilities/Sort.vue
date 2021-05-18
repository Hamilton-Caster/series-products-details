<template>
  <div class="sort-wrap field-wrap">
    <md-field>
      <label for="sortValue">Sort By</label>
      <md-select
        md-dense
        md-direction="bottom-end"
        v-model="selectedOption"
        name="Sort Results"
        id="sortValue">
        <md-option
          v-for="(attribute, index) in sortOptions"
          :key="`${attribute.value}_${index}`"
          :value="attribute.value">
          {{ attribute.name }}
        </md-option>
      </md-select>
    </md-field>
    <div>
      <md-button
        v-show="!isHidden"
        :disabled="isDisabled"
        @click="onSortChanged"
        class="sort-button">
        <font-awesome-icon
          :icon="['fad', sortIcon]" />
      </md-button>
      <md-tooltip md-direction="left">Sort Direction</md-tooltip>
    </div>
  </div>
</template>

<script>
import { SortDirection } from '../enums'

export default {
  name: 'sort',
  props: {
    sortOptions: {
      type: Array,
      default: () => []
    },
    sortBy: {
      type: String,
      default: ''
    },
    sortOrder: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    selectedOption: ''
  }),
  watch: {
    selectedOption: {
      handler: function (selectedOption) {
        this.$emit('sort-select', selectedOption)
      },
      deep: true
    },
    sortBy (sortBy) {
      if (sortBy === '' && this.selectedOption !== '') {
        this.selectedOption = ''
      } else if (sortBy !== null) {
        this.selectedOption = sortBy
      }
    },
    sortOptions: {
      handler: function (sortOptions) {
        let hasSortValue = sortOptions.some(option => option.value === this.selectedOption)
        if (!hasSortValue && sortOptions.length > 0) {
          this.selectedOption = sortOptions[0].value
        } else if (!hasSortValue) {
          this.selectedOption = ''
        }
      },
      deep: true
    }
  },
  computed: {
    sortIcon () {
      return this.sortOrder === SortDirection.Descending ? 'sort-down' : 'sort-up'
    },
    isDisabled () {
      return this.selectedOption === ''
    },
    isHidden () {
      return this.sortOptions.length > 0 && this.selectedOption === this.sortOptions[0].value
    }
  },
  methods: {
    onSortChanged () {
      let sortOrder = ''
      if (this.selectedOption) {
        sortOrder = this.sortOrder === SortDirection.Descending ? SortDirection.Ascending : SortDirection.Descending
      }
      this.$emit('sort-order', sortOrder)
    }
  },
  created () {
    if (this.sortBy !== null) {
      this.selectedOption = this.sortBy
    }
  }
}
</script>

<style lang="scss">
  @import "../../assets/variables";

  .sort-wrap {
    margin-bottom: 1rem;
    @media screen and (min-width: $medium)  {
      margin-left: 15px;
      padding-left: 15px;
    }

    &.field-wrap {
      @media screen and (max-width: $medium)  {
        margin: 1rem .5rem;
        width: auto;
      }
    }

    .sort-button {
      &.md-button {
        background-color: $white;
        border: 1px solid $borderColor;
        min-width: 2.5rem;
        height: 3rem;
        font-size: 1.5rem;

        &:hover {
          background-color: $white;
        }
      }
    }
  }
  .finder-collapsed {
    .sort-wrap {
      margin-bottom: 0.2rem;
    }
  }

</style>
