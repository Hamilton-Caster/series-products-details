<template>
  <transition name="fade" mode="out-in">
    <div class="category-menu-wrap">

      <ul
        class="category-menu"
        :class="categoryDirection">
        <menu-item
          v-for="item in products"
          :key="item.Title"
          :menu-item="item"
          :is-active="selectedCategory && selectedCategory.LandingPageID === item.LandingPageID"
          @menu-click="onCategoryClicked"
          :product-list="productList" />
      </ul>

      <product-menu
        v-if="selectedCategory"
        :selected-category="selectedCategory"
        :product-list="productList" />
    </div>
  </transition>
</template>

<script>
  import MenuItem from './MenuItem'
  import ProductMenu from './ProductMenu'
  export default {
    name: "category-menu",
    components: {ProductMenu, MenuItem},
    props: {
      productList: {
        type: Array
      },
      selectedSeries: {
        type: Object
      }
    },
    data: () => ({
      products: [],
      selectedCategory: null
    }),
    watch: {
      productList: {
        handler: function (productList) {
          // this.selectedSeries = null
          this.updateProducts(productList)
        }
      },
      selectedSeries: {
        handler: function (selectedSeries) {
          this.selectedCategory = null
          this.updateProducts(selectedSeries)
        }
      }
    },
    computed: {
      categoryDirection () {
        return this.selectedCategory ? 'vertical' : 'horizontal'
      }
    },
    methods: {
      updateProducts (selectedSeries) {
        if (selectedSeries) {
          this.products = this.productList.filter(product => product.ParentID === selectedSeries.LandingPageID)
        }
      },
      onCategoryClicked ($event) {
        this.selectedCategory = $event
      }
    },
    created () {
      this.updateProducts(this.selectedSeries)
    },
    mounted () {

    }
  }
</script>

<style scoped lang="scss">

  .category-menu-wrap {
    display: flex;
    height: 100%;

  }

</style>
