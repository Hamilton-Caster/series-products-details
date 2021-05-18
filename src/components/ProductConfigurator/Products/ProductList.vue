<template>
  <div class="container product-list-wrap">
    <div class="row">
      <div class="product-list col-md-12">
        <div class="row inner-wrap">
          <spinner :show-spinner="showSpinner" />
          <div
            v-if="showPopular"
            class="col-md-12">
            <h1>Most Popular {{ ProductTypes.getKey(this.selectedTab) }}</h1>
          </div>
          <product-item
            v-show="!showSpinner"
            v-for="(product, index) in products"
            :key="product.productId"
            :index="index"
            v-bind="product" />
          <div class="col-md-3 list-spacer"></div>
          <div class="col-md-3 list-spacer"></div>
          <div class="col-md-3 list-spacer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ProductItem from './ProductItem'
  import Spinner from '../../Utilities/Spinner'
  import { ProductTypes } from '../../enums'

  export default {
    name: "product-list",
    components: { ProductItem, Spinner},
    props: {
      products: {
        type: Array,
        default: () => []
      },
      selectedTab: {
        type: Number
      },
      showSpinner: {
        type: Boolean,
        default: true
      },
      showPopular: {
        type: Boolean,
        default: true
      }
    },
    data: () => ({
      ProductTypes
    }),
    methods: {

    },
    created () {

    },
    mounted () {

    }
  }
</script>

<style lang="scss">
  @import "../../../assets/variables";

  .finder-collapsed {
    @media screen and (min-width: $medium) {
      & ~ div {
        .product-list {
          // margin-top: 20rem;
        }
      }
    }
  }
  .product-list {
    min-height: 68rem;

    h1 {
      margin: 1rem 0 2rem;
    }
    .inner-wrap {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    .list-spacer {
      height: 0 !important;
      overflow: hidden;
    }
  }
</style>
