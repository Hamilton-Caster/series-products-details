<template>
  <th
    class="table-header"
    @click.prevent="toggleSort()">
    <span
      v-html="headerText"></span>
    <button>
      <font-awesome-icon
        :icon="['fad', sortIcon]" />
    </button>

  </th>
</template>

<script>
import { SortDirection } from '../enums'

export default {
  name: 'table-header',
  props: {
    canSort: {
      type: Boolean,
      default: true
    },
    header: {
      type: Object,
      default: () => {}
    },
    headerText: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: null
    },
    sortDetails: {
      type: Object,
      default: () => ({
        direction: null,
        sortIndex: null
      })
    }
  },
  computed: {
    localSortDirection () {
      return this.sortDetails.sortIndex === this.index ? this.sortDetails.direction : null
    },
    sortIcon () {
      let icon = 'sort'
      if (this.localSortDirection !== null) {
        icon = this.localSortDirection === SortDirection.Descending ? 'sort-down' : 'sort-up'
      }
      return icon
    },

  },
  data: () => ({

  }),
  methods: {
    toggleSort () {
      let sortDirection = null
      switch (this.localSortDirection) {
        case SortDirection.Ascending:
          sortDirection = SortDirection.Descending
          break
        case SortDirection.Descending:
          sortDirection = null
          break
        default:
          sortDirection = SortDirection.Ascending
      }
      this.$emit('sort', {
        index: this.index,
        fieldName: this.header.FieldName,
        sortDirection
      })
    }
  },
  created () {

  },
  mounted () {

  }
}
</script>

<style lang="scss">
  .table-header {
    cursor: pointer;
    
    button {
      background-color: transparent;
      color: #000;
    }
  }
</style>
