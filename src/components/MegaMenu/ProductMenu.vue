<template>
  <transition name="fade" mode="out-in">
    <div class="product-menu-wrap">
      <ul
        class="product-menu"
        :class="productDirection">
        <menu-item
          disable-arrow
          v-for="item in products"
          :key="item.Title"
          :menu-item="item"
          @menu-click="onProductClicked"
          :product-list="productList" />
      </ul>
    </div>
  </transition>
</template>

<script>
  import MenuItem from './MenuItem'

  export default {
    name: "product-menu",
    components: {MenuItem},
    props: {
      productList: {
        type: Array
      },
      selectedCategory: {
        type: Object
      }
    },
    data: () => ({
      products: [],
      selectedProduct: null
    }),
    watch: {
      selectedCategory: {
        handler: function (selectedCategory) {
          this.updateProducts(selectedCategory)
        }
      },
    },
    computed: {
      productDirection () {
        return this.selectedProduct ? 'vertical' : 'horizontal'
      }
    },
    methods: {
      updateProducts (selectedCategory) {
        this.selectedProduct = null
        this.products = this.productList.filter(product => product.ParentID === selectedCategory.LandingPageID)
      },
      onProductClicked ($event) {
        this.selectedProduct = $event
      }
    },
    created () {
      this.updateProducts(this.selectedCategory)
    },
    mounted () {

    }
  }
</script>

<style scoped lang="scss">

  .product-menu-wrap {
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    overflow: auto;

  }
</style>
