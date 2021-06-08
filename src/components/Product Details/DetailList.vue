<template>
  <ul class="series-list">
    <li
      v-for="row in tableRows"
      :key="row.partId"
      class="series-item">
      <div
        class="section-header">
        <template
          v-for="(headerItem, index) in row.sectionHeaderItems">
          <h3
            :key="index"
            class="model-number"
            :class="getClass(headerItem)"
            v-if="headerItem.FieldName.includes('CATALOG_NUMBER')"
            v-html="headerItem[headerItem.FieldName]">
          </h3>
          <span
            :key="index"
            class="type"
            :class="getClass(headerItem)"
            v-else-if="headerItem.FieldName.includes('WHEEL_TYPE')"
            v-html="headerItem[headerItem.FieldName]">
          </span>
        </template>
      </div>
      <ul>
        <li
          v-for="(detailItem, index) in row.sectionDetailItems"
          :key="index"
          :class="getClass(detailItem)">
          <span class="caption">{{ detailItem.FieldCaption }}:</span>

          <template v-if="detailItem.IsFractionColumn">
            <a
              v-if="detailItem.FieldHasHyperLink"
              href="#" v-html="convertToFraction(row[detailItem.FieldName])"></a>
            <span
              v-else
              v-html="convertToFraction(row[detailItem.FieldName])"></span>
          </template>
          <template v-else>
            <a
              v-if="detailItem.FieldHasHyperLink"
              href="#" v-html="row[detailItem.FieldName]"></a>
            <span
              v-else
              v-html="row[detailItem.FieldName]"></span>
          </template>
        </li>

      </ul>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'detail-list',
  props: {
    emptyColsLength: {},
    groupValue: {},
    headers: {},
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
    }
  },
  data: () => ({
    sectionHeaderItems: [],
    sectionDetailItems: []
  }),
  watch: {
    tableRows: {
      handler: function (tableRows) {
        if (tableRows && tableRows.length > 0) {
          this.getFilters()
          this.getRowItems(tableRows)
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
      let filterColumn = this.headers.find(header => header.FieldName === 'DIAMETER_A')
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
    getRowItems (tableRows) {
      this.sectionHeaderItems = []
      this.sectionDetailItems = []

      this.tableRows.forEach(row => {
        row.sectionHeaderItems = []
        row.sectionDetailItems = []
        this.headers.forEach(header => {
          if (header.FieldName.includes('CATALOG_NUMBER')) {
            row.sectionHeaderItems.push({
              [header.FieldName]: row[header.FieldName],
              FieldName: header.FieldName,
              FieldBanner: header.FieldBanner
            })
          } else if (header.FieldName.includes('CATALOG_NUMBER') || header.FieldName.includes('WHEEL_TYPE')) {
            row.sectionHeaderItems.push({
              [header.FieldName]: row[header.FieldName],
              FieldName: header.FieldName,
              FieldBanner: header.FieldBanner
            })
          } else {
            row.sectionDetailItems.push(header)
          }
        console.log('getRowItems :: row.sectionHeaderItems', row.sectionHeaderItems)
        })
      })
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/variables";

.series-item {
  list-style: none;
  padding-bottom: 1rem;

  h3 {
    font-size: 1.25rem;
    line-height: 2rem;
  }

  ul {
    padding-left: 0;
    li {
      padding: 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }

  .section-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .model-number {
      order: 1;
    }
    .type {
      order: 2;
    }
  }

  .caption {
    font-weight: 700;
  }
}

</style>
