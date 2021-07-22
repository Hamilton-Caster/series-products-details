<template>
  <transition
    name="fade"
    mode="out-in">
    <div class="responsive-table">
      <table
        class="series-table">
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
                  :row="row" />
              </template>
            </td>
          </tr>
        </tbody>
      </table>
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
      let classList = ''
      if (header.FieldBanner != null && header.FieldBanner != '') {
        classList += `${header.FieldBanner.replace(' ', '-')}`
        if (header.FieldBanner !== this.groupValue) {
          classList += ' hide'
        }
      }
      if (header.PersistPriority !== 99 || header.FieldHasHyperLink) {
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

  tbody tr:nth-child(odd) {
    background: rgba(230, 230, 230, 1);
  }

  tbody tr:nth-child(2n) {
    background-color: $lightGreyBg;
  }

  th {
    text-align: center;
  }

  th,
  td {
    padding: 8px;
    line-height: 1.42857143;
    vertical-align: top;
    a,
    a[href]{
      color: $primaryColor;
    }
  }

  td {
    border: 1px solid rgba(210, 210, 210, 1);
  }

  .pronto-shipment-star {
    color: $primaryColor;
    font-size: .7rem;
  }

  td {
    &.light {
      background-color: $lightGreyBg !important;
    }
  }

}

</style>
