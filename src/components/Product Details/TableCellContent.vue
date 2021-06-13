<template>
  <div>
    <a
      v-if="header.FieldHasHyperLink"
      :href="getLinkUrl">
      <span
        v-html="getDisplayValue()"></span>
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
    </a>
    <template
      v-else>
      <span
        v-html="getDisplayValue()"></span>
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
    </template>
  </div>
</template>
<script>
export default {
  name: 'table-cell-content',
  props: {
    getLinkUrl: {
      type: String
    },
    header: {
      type: Object
    },
    row: {
      type: Object
    }
  },
  data: () => ({
    hasPronto: false,
    hasWarranty: false
  }),
  methods: {
    getDisplayValue () {
      let displayValue = this.row[this.header.propName]
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
  }
}
</script>

<style lang="scss">

  .pronto-shipment-star {
    margin-left: .25rem;
    margin-right: .25rem;
  }

</style>
