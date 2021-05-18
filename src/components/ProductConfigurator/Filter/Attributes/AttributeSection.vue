<template>
  <transition
    name="fade"
    mode="out-in">
    <div class="product-section">
      <div
        v-for="(group, groupIndex) in groups"
        :key="groupIndex"
        class="product-group">
        <attribute-group
          :group="group"
          :is-modal="isModal"
          :is-finder-expanded="isFinderExpanded"
          @filter-selected="$emit('filter-selected', $event)"
          :attributes="attributeItems" />
      </div>
    </div>
  </transition>
</template>

<script>
import AttributeGroup from './AttributeGroup'

export default {
    name: "attribute-section",
    components: { AttributeGroup },
    props: {
      attributeItems: {
        type: Array,
        default: () => []
      },
      isFinderExpanded: {
        type: Boolean
      },
      isModal: {
        type: Boolean
      },
      groups: {
        type: Array
      }
    },
    data: () => ({

    }),
    methods: {
      onReset () {
        this.$emit('reset-filter')
      }
    },
    created () {

    },
    mounted () {

    }
  }
</script>

<style lang="scss">
  @import "../../../../assets/variables";

  .product-configurator-wrap {
    .product-section {
      @media screen and (min-width: $medium)  {
        padding: 0  1.6rem!important;
      }

      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    &.finder-collapsed {
      @media screen and (min-width: $medium)  {
        .product-configurator-inner {
          .product-section {
            padding: 0 !important;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;
          }
        }
      }
    }
  }

</style>
