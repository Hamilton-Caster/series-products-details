<template>
  <transition
    name="fade"
    mode="out-in">
    <ul
      v-if="headerList.length > 0"
      class="series-list">
      <li
        v-for="row in tableRows"
        :key="row.partId"
        class="series-item">
        <div class="section-header">
          <template
            v-for="header in headerList">
            <h3
              v-if="header.isHeader && header.FieldName === 'CATALOG_NUMBER'"
              class="model-number"
              :class="getClass(header)"
              :key="header.GridConfigID">
              <table-cell-content
                :base-part-details-url="basePartDetailsUrl"
                :header="header"
                :row="row" />
            </h3>
            <div
              v-else-if="header.FieldName === 'WHEEL_TYPE'"
              class="type"
              :class="getClass(header)"
              :key="header.GridConfigID">
              <table-cell-content
                :base-part-details-url="basePartDetailsUrl"
                :header="header"
                :row="row" />
            </div>
            <template
              v-else-if="header.FieldName === 'BEARING_SIZE'">
              <div
                class="roller-bearings"
                :class="getClass(header)"
                :key="header.GridConfigID">
                <table-cell-content
                  :base-part-details-url="basePartDetailsUrl"
                  :header="header"
                  :row="row" />
              </div>
            </template>

          </template>
        </div>
        <ul>
          <template
            v-for="header in headerList">
            <li
              v-if="!header.isHeader"
              :key="header.GridConfigID"
              :class="getClass(header)">
              <span class="caption" v-html="`${header.FieldCaption}:`"></span>
              <table-cell-content
                :base-part-details-url="basePartDetailsUrl"
                :header="header"
                :row="row" />
            </li>
          </template>
        </ul>
      </li>
    </ul>
  </transition>
</template>
<script>
import TableCellContent from './TableCellContent'
import utilities from '../../utilities/helpers'

export default {
  name: 'detail-card',
  components: {TableCellContent},
  props: {
    emptyColsLength: {
      type: Number
    },
    groupValue: {
      type: [String, Number]
    },
    headers: {
      type: Array
    },
    basePartDetailsUrl: {
      type: String
    },
    // selectedGroupOption: {},
    tableRows: {
      type: Array
    },
    /**
     * Copy of table that does not get filtered
     */
    originalTableRows: {
      type: Array
    },
    /**
     * Filter object that gets sent to parent for filtering list
     */
    productFilter: {
      type: Object
    },
    sortDetails: {
      type: Object
    },
    wheelTypeList: {
      type: Array
    }
  },
  computed: {
    headerList () {
      let detailItems = JSON.parse(JSON.stringify(this.headers))
      detailItems.forEach(item => {
        if (item.FieldName === 'CATALOG_NUMBER') {
          item.PersistPriority = 0
          item.isHeader = true
        } else if (item.FieldName === 'WHEEL_TYPE') {
          item.PersistPriority = 1
          item.isHeader = true
        } else if (item.FieldName === 'BEARING_SIZE') {
          item.PersistPriority = 1
          item.isHeader = true
        }
      })
      detailItems.sort(utilities.dynamicSort('-PersistPriority'))
      return detailItems
    }
  },
  methods: {
    getClass (header) {
      let classList = ''
      if (header.FieldBanner != null && header.FieldBanner != '') {
        classList += `${header.FieldBanner.replace(' ', '-')}`
        if (header.FieldBanner !== this.groupValue) {
          classList += ' hide'
        }
      }
      if (header.PersistPriority === 99 && !header.FieldHasHyperLink) {
        classList += ' light'
      }
      return classList
    },
    displayValue (str) {
      return str.replaceAll('@', '')
    },
    onSort ($event) {
      this.$emit('update:sortDetails', {
        direction: $event.sortDirection,
        sortIndex: $event.index,
        propName: $event.propName
      })
    },
    getType (typeName) {
      return this.wheelTypeList.find(type => type.WheelType === typeName)
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/variables";

.detail-card {
  .pronto-shipment-star {
    &.img {
      margin-top: 0;
    }

    position: relative;
    top: -.5rem;
  }
}

.pronto-shipment-star {
  margin-left: .125rem;
  margin-right: .125rem;
  font-size: .7rem;
  height: .7rem;

  &.img {
    margin-top: -.3rem;
  }
}

.series-item {
  list-style: none;
  padding-bottom: 1rem;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid $lightGrey;
  margin-bottom: 1rem;

  h3 {
    font-size: 1.25rem;
    line-height: 2rem;
    a {
      color: $primaryColor !important;
      &:hover {
        color: $primaryColorActive !important;
      }
    }
  }

  ul {
    padding-left: -.5rem;
    margin-left: -.5em;

    li {
      float: left;
      width: 50%;
      padding: 0 .5rem .25rem;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      font-size: 1rem;
      > div {
        > span {
          font-weight: 700;
        }
      }
    }
  }

  .section-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: .25rem;
    .model-number {
      order: 1;
    }
    .type {
      order: 2;
    }
  }

  .roller-bearings {
    order: 2;
    a {
      margin: 0 .3rem;
      padding: 0 .3rem;
      color: $primaryColor !important;
      //border-bottom: 1px solid $primaryColor;
      &:hover {
        color: $primaryColorActive !important;
      }
    }
  }

  .caption {
    font-weight: 300;
  }
}

</style>
