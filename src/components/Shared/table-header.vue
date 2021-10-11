<template>
  <th
    class="table-header">
    <button
      v-if="isSortColumn"
      @click.prevent="toggleSort()">
      <span
        v-html="headerText"></span>
      <font-awesome-icon
        :icon="['fad', sortIcon]" />
    </button>
    <span
      v-else
      v-html="headerText"></span>
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
    isSortColumn: {
      type: Boolean,
      default: false
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
        propName: this.header.propName,
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
    align-items: center;
    flex-direction: row;
    padding: 8px;
    vertical-align: top;
    font-size: 1rem;
    @media screen and (min-width: 2000px) {
      font-size: 1rem;
    }
    > span {
      display: inline-block;
    }

    button {
      background-color: transparent;
      cursor: pointer;
      color: #6d6e70;
      font-weight: 300;
      font-family: roboto,sans-serif!important;

      .svg-inline--fa {
        display: inline-block;
        margin: 0 1rem;
      }
    }
  }
</style>
