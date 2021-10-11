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
            <span
              v-html="getBearingValue(data)"></span>
            <img
              v-if="getBearingHasPronto(data)"
              title="24-48 Hour PRONTO® Shipment."
              src="/portals/0/Support/images/star.png"
              class="pronto-shipment-star img">
          </a>
        </template>
      </template>
    </template>
    <a
      class="product-link"
      v-else-if="header.FieldHasHyperLink"
      :href="getLinkUrl(row[header.propName])">
      <img
        v-if="hasPronto"
        title="24-48 Hour PRONTO® Shipment."
        src="/portals/0/Support/images/star.png"
        class="pronto-shipment-star img">
      <font-awesome-icon
        v-if="hasWarranty"
        title="Hamilton’s Three Year Product Warranty."
        class="pronto-shipment-star"
        :icon="['fas', 'shield-check']" />
      <span
        v-html="getDisplayValue()"></span>
    </a>
    <template v-else-if="header.IsFractionColumn">
      <img
        v-if="hasPronto"
        title="24-48 Hour PRONTO® Shipment."
        src="/portals/0/Support/images/star.png"
        class="pronto-shipment-star img">
      <span
        v-html="convertToFraction(row[header.propName])"></span>
    </template>

    <template
      v-else>

      <img
        v-if="hasPronto"
        title="24-48 Hour PRONTO® Shipment."
        src="/portals/0/Support/images/star.png"
        class="pronto-shipment-star img">
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
        this.hasWarranty = displayValue[0] === amp
        // if @ is last value in string, show Warranty shield/check
        this.hasPronto = displayValue.slice(displayValue.length - 1) === amp

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
    cleanValue (value) {
      return value.replaceAll('@','').replaceAll(' ', '-')
    },
    getBearingLink (value, index) {
      let columnIndex = this.header.propName.substr(0, this.header.propName.indexOf('_'))
      let partNumber = this.row[`${columnIndex - 1}_CATALOG_NUMBER`]
      let cleanedValue = this.cleanValue(this.sizeList[index])
      let cleanedPartNumber = partNumber !=null ? this.cleanValue(partNumber): ''
      return `${this.basePartDetailsUrl}/PartID/${cleanedPartNumber}${cleanedValue}`
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
      return `${this.basePartDetailsUrl}/PartID/${cleanedValue}`
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
    height: 15px;
    font-size: .9rem;

    & ~ span {
      padding-left: .5rem;
    }

    &.img {
      margin-top: -.3rem;
    }
  }

  a.bearing-links {
    text-decoration: none!important;
    display: inline-flex;
    color: $primaryColor;
    margin: .5rem;
    padding: .15rem 0.2rem;
    width: 4.75rem;
    text-align: center;
    font-weight: 700;
    flex-wrap: nowrap;

    &,
    &[href]{
      color: $primaryColor;
      &:hover {
        color: $primaryColorHover;
      }
      span {
        display: block;
        border-bottom: 1px solid $primaryColor;
        &:hover {
          text-decoration: none!important;
          border-bottom: 1px solid $primaryColorHover;
        }
      }
    }

    .pronto-shipment-star {
      margin-top: 0;
    }

    sup, sub {
      vertical-align: baseline;
      position: relative;
      font-size: .7rem;
      padding-left: .1rem;
    }
    sup {
      top: -0.35em;
      left: -.1rem;
    }
    sub {
      top: 0.2em;
    }
  }

</style>
