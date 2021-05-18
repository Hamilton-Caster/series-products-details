<template>
  <transition name="fade" mode="out-in">
    <div class="series-menu-wrap">

      <ul
        v-if="selectedListType !== ListType.Application"
        class="series-menu"
        :class="seriesDirection">
        <menu-item
          v-for="item in seriesList"
          :key="item.Title"
          :menu-item="item"
          :is-active="selectedSeriesItem && selectedSeriesItem.LandingPageID === item.LandingPageID"
          @menu-click="onSeriesClick"
          :product-list="productList" />
      </ul>

      <category-menu
        ref="categoryMenu"
        v-if="selectedListType !== ListType.Application && !hideSubMenu"
        :selected-series="selectedSeriesItem"
        :product-list="productList" />

      <application-menu
        v-else-if="!hideSubMenu"
        :link-list="applicationList" />
    </div>
  </transition>
</template>

<script>
import MenuItem from './MenuItem'
import CategoryMenu from './CategoryMenu'
import {ListType, MenuStorage, ProductSeries} from '../enums'
import ApplicationMenu from './ApplicationMenu'

export default {
  name: 'series-menu',
  components: {ApplicationMenu, CategoryMenu, MenuItem},
  props: {
    productList: {
      type: Array
    },
    selectedListType: {
      type: Number
    },
    selectedProductType: {
      type: String
    }
  },
  data: () => ({
    ListType,
    seriesList: [],
    selectedSeriesItem: null,
    castersByApplication: [],
    wheelsByApplication: [],
    hideSubMenu: false
  }),
  watch: {
    productList: {
      handler: function (productList) {
        this.selectedSeriesItem = null
        this.seriesList = productList.filter(series => (series.IsRootLandingPage))
      }
    },
    selectedListType: {
      handler: function (selectedListType) {
        if (selectedListType === ListType.Application) {
          this.selectedSeriesItem = null
        }
        if (this.castersByApplication == null) {
          this.castersByApplication = JSON.parse(sessionStorage.getItem(MenuStorage.Casters))
        }
        if (this.wheelsByApplication == null) {
          this.wheelsByApplication = JSON.parse(sessionStorage.getItem(MenuStorage.Wheels))
        }
      }
    },
    selectedProductType: {
      handler: function () {
        if (this.castersByApplication == null) {
          this.castersByApplication = JSON.parse(sessionStorage.getItem(MenuStorage.Casters))
        }
        if (this.wheelsByApplication == null) {
          this.wheelsByApplication = JSON.parse(sessionStorage.getItem(MenuStorage.Wheels))
        }
      }
    }
  },
  computed: {
    seriesDirection () {
      return this.selectedSeriesItem ? 'vertical' : 'horizontal'
    },
    selectedList () {
      return ListType.getKey(this.selectedListType)
    },
    applicationList () {
      return this.selectedProductType === ProductSeries.Casters ? this.castersByApplication : this.wheelsByApplication
    }
  },
  methods: {
    onSeriesClick ($event) {
      this.selectedSeriesItem = $event
      this.hideSubMenu = false
    },
    setApplicationLists () {
      this.castersByApplication = JSON.parse(sessionStorage.getItem(MenuStorage.Casters))
      this.wheelsByApplication = JSON.parse(sessionStorage.getItem(MenuStorage.Wheels))

      if (this.castersByApplication == null || this.wheelsByApplication == null) {
        window.addEventListener('storage', () => {
          this.castersByApplication = JSON.parse(sessionStorage.getItem(MenuStorage.Casters))
        })
        window.addEventListener('storage', () => {
          this.wheelsByApplication = JSON.parse(sessionStorage.getItem(MenuStorage.Wheels))
        })
      }
    },
    resetListToRoot () {
      this.hideSubMenu = true
      this.selectedSeriesItem = null
      this.seriesList = null
      this.seriesList = this.productList.filter(series => (series.IsRootLandingPage))
    }
  },
  created () {
    this.setApplicationLists()
  },
  mounted () {

  }
}
</script>

<style lang="scss">
  @import "../../assets/variables";

  .series-menu-wrap {
    height: 100%;
    background-color: $white;
    display: flex;
    width: 100%;
    padding-right: 15px;

    // @media (min-width: 2000px) {
    //   padding-right: 10vw;
    // }

    .series-menu {
      .menu-item {
        > div {
          .text-wrap {
            h3 {
              font-size: 1.5rem;
              line-height: 1.575rem;
            }
          }
        }
      }
    }

  }

</style>
