<template>
  <transition name="fade" mode="out-in">
    <div v-if="!noResults" class="responsive-table">
      <table class="series-table">
        <!--    <colgroup>-->
        <!--      <col :span="emptyColsLength">-->
        <!--      <col :span="selectedGroupOption.cols" class="column-group">-->
        <!--    </colgroup>-->
        <thead>
          <!--      <tr>-->
          <!--        <th-->
          <!--          :colspan="emptyColsLength"></th>-->
          <!--        <th class="groupHeader" :colspan="selectedGroupOption.cols">{{ groupValue}}</th>-->
          <!--      </tr>-->
          <tr>
            <table-header
              v-for="(header, index) in headers"
              :index="index"
              :class="getClass(header)"
              :key="header.GridConfigID"
              :header-text="header.FieldCaption"
              :is-sort-column="header.IsSortColumn"
              :sort-details="sortDetails"
              :header="header"
              @sort="onSort"/>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in tableRows"
            :key="row.partId">
            <td
              v-for="header in headers"
              :key="header.GridConfigID"
              :class="getClass(header)">
              <wheel-type-popover
                v-if="header.FieldName === 'WHEEL_TYPE'"
                :type="getType(row[header.propName])" />
              <template v-else>
                <table-cell-content
                  :base-part-details-url="basePartDetailsUrl"
                  :header="header"
                  :list-type="wheelTypeList"
                  :row="row" />
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="noResults" class="no-results-message">
        <font-awesome-icon :icon="['fas', 'triangle-exclamation']" style="color: #d72027; margin-right: 0.5rem;" />
        We don't currently offer any standard parts that match the filters you've selected. However, we can design a custom solution to meet your exact specifications. Please contact the factory at <a href="tel:513-863-3300">513-863-3300</a> to get started.
    </div>
  </transition>
</template>

<script>
import TableHeader from '../Shared/table-header'
import WheelTypePopover from './wheel-type-popover'
import TableCellContent from './TableCellContent'

export default {
  name: 'detail-table',
  components: {TableCellContent, WheelTypePopover, TableHeader},
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
    },
    noResults: { // <-- Add this prop
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    // sortDetails: {
    //   direction: null,
    //   sortIndex: null
    // }
  }),
  methods: {
    getClass (header) {
      let classList = header.FieldName
      if (header.FieldBanner != null && header.FieldBanner != '') {
        classList += ` ${header.FieldBanner.replace(' ', '-')}`
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

.groupHeader {
  // background-color: $lightGrey;
  text-align: center;
}

.column-group {
  background-color: $lightGreyBg;
}

.series-table {
  width: 100%;
  max-width: 100%;
  empty-cells: show;
  border-collapse: collapse;
  border-spacing: 0;
  border: 0;
  padding: 0;
  vertical-align: top;
  line-height: 19px;
  text-align: center;
  font-family: roboto, sans-serif !important;
  font-style: normal !important;
  font-weight: 400;
  color: rgba(109, 110, 112, 1) !important;
  font-size: 14px;
  margin-top: 1rem;

  tbody tr:nth-child(odd) {
    background: rgba(230, 230, 230, 1);
  }

  tbody tr:nth-child(2n) {
    background-color: $lightGreyBg;
  }

  th {
    text-align: center;
    vertical-align: middle;

    @media screen and (min-width: 2000px) {
      font-size: 1rem !important;
    }
    span {
      text-align: center;
    }
  }

  th.BEARING_SIZE {
    text-align: left;
    padding-left: 3.3rem;
  }
  td {
    padding: 8px;
    vertical-align: top;
    &.BEARING_SIZE {
      text-align: left;
      padding: 0 2rem;
      //width: 25rem;
    }
    a,
    a[href]{
      color: $primaryColor;
    }
  }

  td {
    border: 1px solid rgba(210, 210, 210, 1);
    line-height: 1.42857143;
  }

  .pronto-shipment-star {
    color: $primaryColor;
    font-size: .7rem;
    height: .9rem;


    &.img {
      margin-top: -.3rem;
    }
  }

  td {
    &.light {
      background-color: $lightGreyBg !important;
    }
  }

}
.no-results-message {
    font-size: 1.5rem;
    margin: 5% 10% 5% 10%;
    line-height: 2rem;
}

</style>
