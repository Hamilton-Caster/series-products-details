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
            v-if="headerItem.FieldName.includes('CATALOG_NUMBER')">
            <a
              :href="getLinkUrl(headerItem[headerItem.FieldName])">
              <span
                v-html="getDisplayValue(headerItem[headerItem.FieldName])"></span>
              <font-awesome-icon
                v-if="hasWarranty"
                title="Hamilton’s Three Year Product Warranty."
                class="pronto-shipment-star"
                :icon="['fas', 'shield-check']" />
              <img
                v-if="hasPronto"
                title="24-48 Hour PRONTO® Shipment."
                src="/portals/0/Support/images/star.png"
                class="pronto-shipment-star img">

            </a>
          </h3>
          <span
            :key="index"
            class="type"
            :class="getClass(headerItem)"
            v-else-if="headerItem.FieldName.includes('WHEEL_TYPE')"
            v-html="headerItem[headerItem.FieldName]">
          </span>
          <div
            :key="index"
            class="bearing-size"
            v-else-if="headerItem.FieldName.includes('BEARING_SIZE')">
            <table-cell-content
              :base-part-details-url="basePartDetailsUrl"
              :header="headerItem[headerItem.FieldName]"
              :row="row" />
          </div>
        </template>
      </div>
      <ul>
        <li
          v-for="(detailItem, index) in row.sectionDetailItems"
          :key="index"
          v-show="checkVisibility(detailItem)"
          :class="getClass(detailItem)">
          <span class="caption" v-html="`${detailItem.FieldCaption}:`"></span>
          <table-cell-content
            :base-part-details-url="basePartDetailsUrl"
            :header="detailItem"
            :row="row" />
        </li>

      </ul>
    </li>
  </ul>
</template>
<script>
import TableCellContent from './TableCellContent'
import utilities from '../../utilities/helpers'

export default {
  name: 'detail-list',
  components: { TableCellContent },
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
    basePartDetailsUrl: {
      type: String
    },
    hideLowPriority: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    sectionHeaderItems: [],
    sectionDetailItems: [],
    hasWarranty: false,
    hasPronto: false
  }),
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
    getRowItems () {
      this.sectionHeaderItems = []
      this.sectionDetailItems = []

      this.tableRows.forEach(row => {
        row.sectionHeaderItems = []
        row.sectionDetailItems = []
        this.headers.forEach(header => {
          if (header.FieldName.includes('CATALOG_NUMBER') || header.FieldName.includes('WHEEL_TYPE') || header.FieldName.includes('BEARING_SIZE')) {
            row.sectionHeaderItems.push({
              [header.FieldName]: row[header.propName],
              FieldName: header.FieldName,
              FieldBanner: header.FieldBanner
            })
          } else {
            row.sectionDetailItems.push(header)
          }
        })
        row.sectionDetailItems.sort(utilities.dynamicSort('-PersistPriority'))
      })
    },
    checkVisibility (item) {
      return !this.hideLowPriority || item.PersistPriority !== 99
    },
    getDisplayValue (data) {
      let amp = '@'
      // if @ is first value in string, show Pronto star
      this.hasPronto = data[0] === amp
      // if @ is last value in string, show Warranty shield/check
      this.hasWarranty = data.slice(data.length - 1) === amp
      return data.replaceAll('@', '')
    },
    getLinkUrl (value) {
      let cleanedValue = value.replaceAll('@','')
      return `${this.basePartDetailsUrl}/PartId/${cleanedValue}`
    },

  },
  mounted () {
    if (this.tableRows && this.tableRows.length > 0) {
      this.getRowItems()
    }

  }
}
</script>

<style lang="scss">
@import "../../assets/variables";

.pronto-shipment-star {
  margin-left: .25rem;
  margin-right: .25rem;
  font-size: .9rem;
  height: .9rem;


  &.img {
    margin-top: -.3rem;
  }
}

.series-item {
  list-style: none;
  padding-bottom: 1rem;

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
    padding-left: 0;
    margin-left: 0;
    li {
      float: left;
      width: 50%;
      padding: 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      font-size: 1rem;
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
