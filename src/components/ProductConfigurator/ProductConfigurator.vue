<template>
  <!--  v-click-outside="showOverlay"-->
  <div

    ref="productConfigurator"
    class="product-configurator">
    <template v-if="isModal">
      <md-dialog
        class="product-finder-modal"
        :md-active.sync="showDialog">
        <md-button
          class="close-modal-button"
          @click="showDialog = false"><font-awesome-icon :icon="['fas', 'times']" /></md-button>
        <product-filter
          v-scroll="onScroll"
          ref="productFilter"
          :configurator-list="configuratorList"
          :is-finder-expanded="isFinderExpanded"
          :is-modal="isModal"
          :pagination.sync="pagination"
          :selected-tab.sync="selectedTab"
          :show-spinner="showSpinner"
          :sort-options="sortOptions"
          :total-items="totalItems"
          :has-filters.sync="hasFilters"
          @filter-change="onFilterChange" />
      </md-dialog>
    </template>
    <template v-else>
      <product-filter
        v-scroll="onScroll"
        ref="productFilter"
        :configurator-list="configuratorList"
        :is-finder-expanded="isFinderExpanded"
        :is-modal="isModal"
        :pagination.sync="pagination"
        :selected-tab.sync="selectedTab"
        :show-spinner="showSpinner"
        :sort-options="sortOptions"
        :total-items="totalItems"
        :has-filters.sync="hasFilters"
        @filter-change="onFilterChange" />
    </template>
    <product-list
      v-if="!isModal"
      :show-popular="!hasFilters"
      :selected-tab="selectedTab"
      :show-spinner="showSpinner"
      :products="productList" />
  </div>
</template>

<script>
import {ProductTypes, ScrollToResults, SortDirection} from '../enums'
import { getListAPI } from '../../api'
import ProductList from './Products/ProductList'
import ProductFilter from './Filter/ProductFilter'

export default {
  name: 'product-configurator',
  components: {ProductFilter, ProductList},
  props: {
    moduleId: {
      type: String
    },
    editMode: {
      type: String
    },
    isModal: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      // DNN Module services
      svc: {
        moduleId: this.moduleId,
        path: "AcuitiSolutions/ProductConfigurator",
        controller: 'ItemController'
      },
      antiForgery: null,
      hasFilters: true,
      isFinderExpanded: true,
      moduleService: {},
      // Component Items
      collapseBreakpoint: 100,
      filterHeight: null,
      paddingBreakpoint: 400,
      pagination: {
        currentPage: 1
      },
      productList: [],
      scrollToResults: false,
      selectedTab: this.getSelectedTab(),
      showDialog: false,
      showSpinner: true,
      sortOptions: [],
      totalItems: null,
      configuratorList: [],
      configuratorGroups: []
    }
  },
  computed: {
    isEdit () {
      return (this.editMode == 'True')
    }
  },
  watch: {
    showDialog: {
      handler: function (showDialog) {
        if (this.isModal) {
          if (showDialog) {
            // add class to body
            document.body.classList.add('show-modal')
          } else {
            // remove class from body
            document.body.classList.remove('show-modal')
          }
        }
      }
    }
  },
  methods: {
    getList (configuratorParams, callback) {
      this.showSpinner = true
      this.totalItems = null
      // Default configurator parameters for initial load
      if (configuratorParams == null) {
        configuratorParams = {
          ConfiguratorType: ProductTypes.getKey(this.selectedTab),
          AttributeValues: [],
          CurrentPageNumber: this.pagination.currentPage,
          SortBy: this.sortBy,
          SortOrder: this.sortOrder
        }
      }
      // get the service for this module from the services object
      let svc = this.moduleService[`svc-${this.moduleId}`]
      let antiForgery = document.getElementsByName("__RequestVerificationToken")[0].value

      getListAPI(svc, antiForgery, configuratorParams)
        .then(res => {
          this.configuratorList = res.data.ProductConfiguratorAttributes
          this.totalItems = res.data.RecordCount
          if (!this.isModal) {
            this.productList = res.data.ProductConfiguratorResults
            this.pagination.currentPage = res.data.CurrentPageNumber
            this.getSortList(res.data.SORT_ITEMS)
            if (this.scrollToResults) {
              setTimeout(() => {
                let utilitiesWrapEle = document.getElementById('utilitiesWrap').getBoundingClientRect()
                let menu =  document.getElementById('bs-megadropdown-tabs').clientHeight
                let padding = window.innerWidth > 992 ? 80 : 48
                let targetYPosition = utilitiesWrapEle.top - menu - this.collapseBreakpoint - padding

                window.scrollTo(0, targetYPosition)
                this.scrollToResults = false
              }, 50)
            }
          }

          this.showSpinner = false
        })
    },
    onFilterChange ($event, callback) {
      if (!this.isModal) {
        let scrollToResults = JSON.parse(sessionStorage.getItem(ScrollToResults))
        if (scrollToResults) {
          this.scrollToResults = scrollToResults
          sessionStorage.setItem(ScrollToResults, JSON.stringify(false))
        }
      }
      this.getList($event, callback)
    },
    /**
     * When page is scrolled, determine if the finder should be expanded or collapsed
     * @param e - scroll event
     * @param ele - scrolled element
     */
    onScroll (e, ele) {
      if (this.filterHeight === null || this.filterHeight === undefined) {
        this.filterHeight =  this.$refs.productFilter.$el.clientHeight
        this.$refs.productConfigurator.style.setProperty('--wrapper-height', `${this.filterHeight}px`)
      }
      this.toggleFilters(e, ele)

    },
    toggleFilters (e, ele) {
      let domRect = ele.getBoundingClientRect()
      let spaceBelow = window.pageYOffset - domRect.bottom // domRect.top // window.pageYOffset + domRect.top

      let width = window.innerWidth
      if (!this.isModal && width > 992) {
        if (this.isFinderExpanded) {
          this.isFinderExpanded = spaceBelow < this.collapseBreakpoint
        } else {
          this.isFinderExpanded = window.scrollY < this.paddingBreakpoint
        }
      } else {
        this.isFinderExpanded = true
      }
    },
    getSelectedTab () {
      let configuratorType = JSON.parse(sessionStorage.getItem('ConfiguratorType'))
      return configuratorType != null ? ProductTypes[configuratorType] : ProductTypes.Casters
    },
    showOverlay () {
      if (this.isModal) {
        this.showDialog = true
      }
    },
    getSortList (sortOptions) {
      let options = sortOptions.map(option => ({
        name: option.CAPTION,
        value: option.ATTRIBUTE_NAME
      }))
      this.sortOptions = [{
        name: 'Popularity',
        value: ''
      },
        ...options
      ]

    },
    setAppHeight () {
      const doc = document.documentElement
      doc.style.setProperty('--app-height', `${doc.clientHeight}px`)
    }
  },
  created () {
    this.moduleService[`svc-${this.moduleId}`] = this.svc
  },
  mounted () {
    let productFinderMenuItem = document.getElementById('productFinderMenu')
    if (this.isModal) {
      productFinderMenuItem.onclick = this.showOverlay
      document.getElementById('Body').classList.remove('product-finder-active')
    } else {
      let scrollToResults = JSON.parse(sessionStorage.getItem(ScrollToResults))
      if (scrollToResults) {
        this.scrollToResults = scrollToResults
        sessionStorage.setItem(ScrollToResults, JSON.stringify(false))
      }

      document.getElementById('Body').classList.add('product-finder-active')
    }

    window.addEventListener('resize', this.setAppHeight)
    this.setAppHeight()
  }
}
</script>

<style lang="scss">
  @import "../../assets/variables";

  :root {
    --app-height: 100%;
  }

  .product-list-wrap {
    margin-top: 0;
  }
  .product-configurator-wrap.finder-collapsed {
    & ~ .product-list-wrap {
      margin-top: var(--wrapper-height);
    }
  }
  .product-configurator-wrap.finder-expanded {
    .product-configurator-inner {
      background-color: $lightGreyBg;
      & > div {
        margin: 0 auto;
        max-width: 95%;

        @media screen and (min-width: $large) {
          max-width: 90%;
        }
        @media screen and (min-width: $x-large) {
          max-width: 112.5rem;
        }
      }
    }
  }
  .product-finder-modal {
    position: absolute;

    .md-button.close-modal-button {
      right: .4rem;
    }

    /* Let's get this party started */
    ::-webkit-scrollbar {
      width: 12px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
      -webkit-border-radius: 10px;
      border-radius: 10px;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      -webkit-border-radius: 10px;
      border-radius: 10px;
      background: rgba($primaryColor,0.8);
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    }
    ::-webkit-scrollbar-thumb:window-inactive {
      background: rgba($primaryColor,0.4);
    }

    .md-theme-default {
      &.md-dialog-container {
        --md-theme-default-text-primary-on-background: $white;

        background-color: $darkGreyBg;
        -webkit-text-fill-color: $white;
        color: $white;
        height: var(--app-height);

        .product-configurator-wrap {
          height: var(--app-height);

          .product-configurator-inner {
            background-color: transparent;
            & > div {
              max-width: 95%;
              @media screen and (min-width: $large)  {
                max-width: 90%;
              }
              @media screen and (min-width: $x-large)  {
                max-width: 86.25rem;
              }
              margin: 0 auto;
              display: flex;
              flex-direction: column;
              height: var(--app-height);

              .filter {
                background-color: transparent;
                height: calc(var(--app-height) - 6rem);
                flex: 1;
                min-height: unset;
                margin-bottom: 0;
                padding-bottom: 7rem;

                .filter-container {
                  height: 100%;

                  .filter-inner {
                    height: 100%;

                    .finder-tabs .md-button.reset-button {
                      right: -15px;
                      top: 25px;
                      height: 1rem;
                    }

                    .product-section {
                      overflow: auto;
                      height: 100%;
                    }
                  }

                }

                .product-section {
                  .product-group {
                    --section-width: 100%;
                    @media screen and (min-width: $large)  {
                      --section-width: 50%;
                    }
                    @media screen and (min-width: $x-large)  {
                      --section-width: 33%;
                    }
                  }
                }
              }
            }
          }
        }


        h1, h2, h3, h4, h5, h6,
        input, textarea,
        .md-icon.md-theme-default.md-icon-font,
        .finder-tabs .md-tabs.md-theme-default .md-tabs-navigation .md-button.md-active,
        .md-field.md-theme-default .md-helper-text,
        .md-field.md-theme-default .md-count,
        .md-field.md-theme-default label,
        .md-field.md-theme-default.md-focused .md-input,
        .md-field.md-theme-default.md-focused .md-textarea,
        .md-field.md-theme-default.md-has-value .md-input,
        .md-field.md-theme-default.md-has-value .md-textarea {
          -webkit-text-fill-color: $white;
          color: $white;
        }

        .field-wrap .md-field {
          background-color: $mediumDarkGrey;
          border-color: $mediumLightGrey;
        }

        #findProductsButton {
          margin-bottom: 2rem;

          .item-count {
            display: none;
            font-style: italic;
            font-size: 1.7375rem;
            align-self: center;
            padding-right: 1.4rem;
            -webkit-text-fill-color: rgba($white, .7);
            color: rgba($white, .7);
            @media screen and (min-width: $small)  {
              display: block;
            }
          }

          @media screen and (min-width: $medium)  {
            padding: 0  1.6rem!important;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
          }

          .md-theme-default {
            &.md-button {
              background-color: $primaryColor;
              padding: 0.875rem 1.375rem;
              height: auto;
              @media screen and (max-width: $small)  {
                width: 96%;
              }

              &:hover { background-color: $primaryColorHover;}
              &:active { background-color: $primaryColorActive;}

              .md-button-content {
                -webkit-text-fill-color: $white;
                color: $white;
                text-align: center;
                font-size: 2.125rem;
                line-height: 2.5625rem;
                letter-spacing: 0px;
                opacity: 1;
                text-transform: none;
                font-weight: 700;
              }
            }
          }
        }
      }
    }

    .md-dialog-container {
      margin: 0;
      width: 100%;
      height: 100%;
      position: fixed;
      min-width: 100vw;
      min-height: 100vh;
      z-index: 10000;
      top: 0;
    }
  }

  .md-button {
    &.close-modal-button {
      position: absolute;
      right: 1rem;
      width: 2.5rem;
      min-width: 2.5rem;
      height: 2.5rem;
      font-size: 2.5rem;
      top: 0;
      z-index: 20;
    }
  }

  body {
    &.show-modal {
      overflow: hidden;

      .navbar,
      #hbl-live-chat-wrapper {
        display: none;
      }
    }
  }

</style>
