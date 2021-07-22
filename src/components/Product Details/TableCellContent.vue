<template>
  <div>
    <template
      v-if="dataColumnValue.length > 0">
      <template
        v-if="header.FieldHasHyperLink">
        <template
          v-for="(data, index) in dataColumnValue">
          <a
            class="bearing-links"
            v-if="data !== ''"
            :key="data"
            :href="getBearingLink(data, index)">
            <font-awesome-icon
              v-if="getBearingHasPronto(data)"
              title="24-48 Hour PRONTO® Shipment."
              class="pronto-shipment-star"
              :icon="['fas', 'star']" />
            <span
              v-html="getBearingValue(data)"></span>
          </a>
        </template>
      </template>
    </template>
    <a
      v-else-if="header.FieldHasHyperLink"
      :href="getLinkUrl(row[header.propName])">
      <font-awesome-icon
        v-if="hasPronto"
        title="24-48 Hour PRONTO® Shipment."
        class="pronto-shipment-star"
        :icon="['fas', 'star']" />
      <font-awesome-icon
        v-if="hasWarranty"
        title="Hamilton’s Three Year Product Warranty."
        class="pronto-shipment-star"
        :icon="['fas', 'shield-check']" />
      <span
        v-html="getDisplayValue()"></span>
    </a>
    <template v-else-if="header.IsFractionColumn">
      <font-awesome-icon
        v-if="hasPronto"
        class="pronto-shipment-star"
        :icon="['fas', 'star']" />
      <span
        v-html="convertToFraction(row[header.propName])"></span>
    </template>

    <template
      v-else>
      <font-awesome-icon
        v-if="hasPronto"
        title="24-48 Hour PRONTO® Shipment."
        class="pronto-shipment-star"
        :icon="['fas', 'star']" />
      <font-awesome-icon
        v-if="hasWarranty"
        title="Hamilton’s Three Year Product Warranty."
        class="pronto-shipment-star"
        :icon="['fas', 'shield-check']" />
      <span
        v-html="getDisplayValue()"></span>
    </template>
  </div>
</template>
<script>
export default {
  name: 'table-cell-content',
  props: {
    header: {
      type: Object
    },
    row: {
      type: Object
    },
    basePartDetailsUrl: {
      type: String
    }
  },
  data: () => ({
    hasPronto: false,
    hasWarranty: false,
    dataColumnValue: [],
    sizeList: []
  }),
  methods: {
    getDisplayValue (data = null) {
      let displayValue = data != null ? data : this.row[this.header.propName]
      if (this.header.FieldName === 'CATALOG_NUMBER') {
        let amp = '@'
        // if @ is first value in string, show Pronto star
        this.hasPronto = displayValue[0] === amp
        // if @ is last value in string, show Warranty shield/check
        this.hasWarranty = displayValue.slice(displayValue.length - 1) === amp

        displayValue = displayValue.replaceAll('@', '')
      }
      return displayValue
    },
    getBearingValue (data) {
      let amp = '@'
      return data.replaceAll(amp, '')
    },
    getBearingHasPronto (data) {
      let amp = '@'
      return data.slice(data.length - 1) === amp
    },
    getBearingLink (value, index) {
      let cleanedValue = this.sizeList[index].replaceAll('@','')
      return `${this.basePartDetailsUrl}?PartId=${this.row['0_BASE_PART']}-${cleanedValue}`
    },
    convertToFraction (value) {
      let amp = '@'
      let hasPronto = value.slice(value.length - 1) === amp
      if (hasPronto) {
        value = value.replaceAll('@', '')
      }

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
      if (hasPronto) {
        value = `${value}@`
      }

      return value
    },
    getLinkUrl (value) {
      let cleanedValue = value.replaceAll('@','')
      return `${this.basePartDetailsUrl}/PartId/${cleanedValue}`
    },
  },
  created () {
    if (this.header.FieldName === 'BEARING_SIZE') {
      let displayValue = this.row[this.header.propName]
      this.sizeList = displayValue.split(',')
      this.dataColumnValue = []
      this.sizeList.forEach(size => {
        this.dataColumnValue.push(this.convertToFraction(size))
      })

    }
  }
}
</script>

<style lang="scss">
  @import "../../assets/variables";

  .pronto-shipment-star {
    margin-left: .25rem;
    margin-right: .25rem;

    & ~ span {
      padding-left: .5rem;
    }
  }

  a.bearing-links {
    padding: 0 .75rem;
    text-decoration: none!important;
    &:hover {
      text-decoration: none!important;
      span {
        border-bottom: 1px solid $primaryColor;
      }
    }
  }

</style>
