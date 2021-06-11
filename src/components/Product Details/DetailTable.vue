<template>
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
          <template v-if="header.IsFractionColumn">
            <a
              v-if="header.FieldHasHyperLink"
              :href="getLinkUrl(row[header.FieldName])">
              <font-awesome-icon
                v-if="hasPronto(row[header.FieldName])"
                class="pronto-shipment-star"
                :icon="['fas', 'star']" />
              <span v-html="convertToFraction(row[header.FieldName])"></span>
            </a>
            <template
              v-else>
              <font-awesome-icon
                v-if="hasPronto(row[header.FieldName])"
                class="pronto-shipment-star"
                :icon="['fas', 'star']" />
              <span
                v-html="convertToFraction(row[header.FieldName])"></span>
            </template>
          </template>
          <wheel-type-popover
            v-else-if="header.FieldName === 'WHEEL_TYPE'"
            :type="getType(row[header.FieldName])" />
          <template v-else>
            <a
              v-if="header.FieldHasHyperLink"
              :href="getLinkUrl(row[header.FieldName])">
              <font-awesome-icon
                v-if="hasPronto(row[header.FieldName])"
                class="pronto-shipment-star"
                :icon="['fas', 'star']" />
              <span
                v-html="displayValue(row[header.FieldName])"></span>
            </a>
            <template
              v-else>
              <font-awesome-icon
                v-if="hasPronto(row[header.FieldName])"
                class="pronto-shipment-star"
                :icon="['fas', 'star']" />
              <span
                v-html="displayValue(row[header.FieldName])"></span>
            </template>
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import TableHeader from '../Shared/table-header'
import WheelTypePopover from './wheel-type-popover'
export default {
  name: 'detail-table',
  components: {WheelTypePopover, TableHeader},
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
  watch: {
    tableRows: {
      handler: function (tableRows) {
        if (tableRows && tableRows.length > 0) {
          this.getFilters()
        }
      },
      immediate: true
    }
  },
  methods: {
    convertToFraction (value) {
      let fractionCheck = /(\d+)\/(\d+)$/g
      // Check to see if value contains a fraction
      if (value.match(fractionCheck)) {
        // Split the value between whole number and fraction
        let numberArray = value.split(' ')
        numberArray.forEach((fraction, index) => {
          // check each segment to see if it is the fraction.
          if (fraction.match(fractionCheck)) {
            // if this is the fraction, split it at the "/"
            let fractionArray = fraction.split('/')
            // convert the fractional value to formatted html
            let formattedFraction = `<sup>${fractionArray[0]}</sup>&frasl;<sub>${fractionArray[1]}</sub>`
            // if this is not the first number, rejoin whole number and formatted fraction, otherwise return formatted fraction
            value = index > 0 ? `${numberArray[0]} ${formattedFraction}` : formattedFraction
          }
        })
      }
      return value
    },
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
    getFilters () {
      // let filterLabel = null
      // let filterProperty = null
      // let filterList = []
      let productFilter = {
        filterLabel: null,
        filterProperty: null,
        filterList: []
      }
      // TODO: Temporary to get a filter value
      let filterColumn = this.headers.find(header => header.IsFilterColumn)
      // let filterColumn = this.headers.find(header => header.IsFilterColumn)
      if (filterColumn != null) {
        productFilter.filterLabel = filterColumn.FieldCaption
        productFilter.filterProperty = filterColumn.FieldName
        let filterValues = []
        this.originalTableRows.forEach(row => {
          filterValues.push(row[filterColumn.FieldName])
        })
        productFilter.filterList = [...new Set(filterValues)]
      } else {
        productFilter.filterLabel = null
        productFilter.filterProperty = null
      }
      // this.$emit('update:filterLabel', filterLabel)
      // this.$emit('update:filterProperty', filterProperty)
      // this.$emit('update:filterList', filterList)
      this.$emit('update:productFilter', productFilter)
    },
    hasPronto (str) {
      let amp = '@'
      // if (str.slice(-amp.length) === amp) {
      //   str.slice(0, -1)
      // }
      return str.slice(-1) === amp
    },
    getLinkUrl (value) {
      let cleanedValue = value.replaceAll('@','')
      return `${this.basePartDetailsUrl}/PartId/${cleanedValue}`
    },
    displayValue (str) {
      return str.replaceAll('@', '')
    },
    onSort ($event) {
      console.log('sort :: $event', $event)
      this.$emit('update:sortDetails', {
        direction: $event.sortDirection,
        sortIndex: $event.index,
        fieldName: $event.fieldName
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
