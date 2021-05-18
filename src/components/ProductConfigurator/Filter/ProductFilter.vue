<template>
  <div
    ref="productConfigurator"
    class="product-configurator-wrap"
    :class="productWrapClassList">
    <div class="product-configurator-inner">
      <div>
        <div class="filter">
          <div class="filter-container">
            <spinner :show-spinner="showFilterSpinner" />
            <div class="filter-inner">
              <finder-tabs
                v-show="isFinderExpanded"
                v-if="selectedTab != null"
                @change="onTabChanged"
                @reset-filter="onReset"
                :disable-reset-button="isResetDisabled"
                :is-finder-expanded="isFinderExpanded"
                :selected-tab.sync="selectedTab" />
              <attribute-section
                :attribute-items="attributeList"
                :is-finder-expanded="isFinderExpanded"
                :is-modal="isModal"
                @filter-selected="onFilterSelected"
                :groups="configuratorGroups" />
              <filter-tags
                v-if="!isModal"
                v-show="!isFinderExpanded"
                @delete-tag="onDeleteTag"
                :tag-list.sync="selectedAttributes" />
            </div>
          </div>
          <md-button
            v-show="!isFinderExpanded"
            @click="onReset"
            :disabled="isResetDisabled"
            class="reset-button-filter">
            Reset Filter
          </md-button>
        </div>
        <div
          v-if="!isModal"
          id="utilitiesWrap"
          class="utilities">
          <div class="utilities-container">
            <div class="utilities-inner">
              <sort
                :sort-by.sync="sortBy"
                :sort-order.sync="sortOrder"
                @sort-select="onSortSelected"
                @sort-order="onSortDirectionChange"
                :sort-options="fullSortList" />
              <div
                v-show="selectedAttributes != null && selectedAttributes.length > 0"
                class="item-count">
                <span v-show="totalItems > 0">{{ totalItems }} items match your criteria.</span>
                <span v-show="totalItems === undefined">No items were found that match your criteria.</span>
              </div>
              <pager
                :pagination="pagination"
                v-show="!pagerDisabled"
                @page-changed="onPagerChange"
                :total-items="totalItems" />
            </div>
          </div>
        </div>
        <div
          v-else
          id="findProductsButton">
          <div
            v-show="selectedAttributes != null && selectedAttributes.length > 0"
            class="item-count">
            <span v-show="totalItems > 0">{{ totalItems }} items match your criteria.</span>
            <span v-show="totalItems === undefined">No items were found that match your criteria.</span>
          </div>
          <md-button
            @click="onFindProductClick">
            Show {{ ProductTypes.getKey(selectedTab) }}
          </md-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import FinderTabs from '../FinderTabs'
  import AttributeSection from './Attributes/AttributeSection'
  import Spinner from '../../Utilities/Spinner'
  import Sort from '../../Utilities/Sort'
  import Pager from '../../Utilities/Pager'
  import FilterTags from '../FilterTags'
  import {
    AttributeTypes,
    FinderClassNames,
    ProductTypes,
    ScrollToResults,
    SessionStorageKeys,
    SortDirection
  } from '../../enums'

  const ConfigResultsPage = '/Configurator-Search-Results'

  export default {
    name: "product-filter",
    components: { FilterTags, Pager, Sort, AttributeSection, Spinner, FinderTabs },
    props: {
      configuratorList: {
        type: Array
      },
      hasFilters: {
        type: Boolean
      },
      isModal: {
        type: Boolean
      },
      /**
       * @param {Number} selectedPage - Selected page. 1 based.
       */
      pagination: {
        type: Object
      },
      selectedTab: {
        type: Number
      },
      showSpinner: {
        type: Boolean
      },
      sortOptions: {
        type: Array,
        default: () => []
      },
      totalItems: {
        type: Number
      },
      isFinderExpanded: {
        type: Boolean,
        default: true
      }
    },
    data: () => ({
      collapseBreakpoint: 500,
      paddingBreakpoint: 1,
      configuratorGroups: [],
      configurationParams: {
        AttributeValues: [],
        ConfiguratorType: null,
        CurrentPageNumber: 1,
        SortBy: '',
        SortOrder: ''
      },
      configuratorResultsPage: ConfigResultsPage,
      // isFinderExpanded: true,
      isResetDisabled: true,
      filterHeight: null,
      attributeList: [],
      pagerDisabled: true,
      productWrapClassList: FinderClassNames.Expanded,
      selectedAttributes: [],
      sortBy: null,
      sortOrder: null,
      itemSelected: true,
      tabChanged: false,
      ProductTypes
    }),
    watch: {
      isFinderExpanded: {
        handler: function (newValue, oldValue) {
          if (newValue !== oldValue) {
            this.updateCollapse(newValue)
          }
        }
      },
      pagination: {
        handler: function (pageValue) {
          this.updatePage(pageValue)
        }
      },
      selectedTab: {
        handler: function (value) {
          this.selectProductType(value)
        },
        immediate: true
      },
      configuratorList (configuratorList, oldList) {
        let selectedChanged = JSON.stringify(configuratorList) !== JSON.stringify(oldList)
        if (selectedChanged || this.isModal) {
          this.setAttributeList(configuratorList)
        }
      },
      attributeList: {
        handler: function (attributeList) {
          if (this.itemSelected) {
            this.updateSelectedAttributes(attributeList)
          }
          this.itemSelected = false
        },
        deep: true
      },
      selectedAttributes (selectedAttributes, oldList) {
        let selectedChanged = JSON.stringify(selectedAttributes) !== JSON.stringify(oldList)
        this.configurationParams.AttributeValues = selectedAttributes
        this.configurationParams.CurrentPageNumber = 1
        if (selectedAttributes != null && selectedAttributes.length === 0) {
          this.$emit('update:hasFilters', false)
        } else {
          this.$emit('update:hasFilters', true)
        }
        // if attributes have changed, update the session storage and get the list
        if (selectedChanged) {
          this.setSessionStorage(this.configurationParams.ConfiguratorType, selectedAttributes)
          this.getList(this.configurationParams)
        }
        this.tabChanged = false
      },
      showSpinner () {
        if (this.showSpinner) {
          this.productWrapClassList = `${this.productWrapClassList} show-spinner`
        } else {
          this.productWrapClassList = this.productWrapClassList.replace(' show-spinner', '')
        }
      }
    },
    computed: {
      showFilterSpinner () {
        return this.showSpinner
      },
      fullSortList () {
        if (this.sortOptions.length > 0) {
          return [...this.sortOptions]
        } else {
          return []
        }
      }
    },
    methods: {
      updateCollapse (isExpanded) {
        this.productWrapClassList = isExpanded ? FinderClassNames.Expanded : FinderClassNames.Collapsed
      },
      getList (configuratorParams) {
        this.$emit('filter-change', configuratorParams)
      },
      onPagerChange ($event) {
        sessionStorage.setItem('Pagination', JSON.stringify($event))
        this.$emit('update:pagination', $event)
      },
      onSortDirectionChange ($event) {
        let selectedTabName = ProductTypes.getKey(this.selectedTab)
        sessionStorage.setItem(`SortOrder_${selectedTabName}`, JSON.stringify($event))
        this.sortOrder = $event
        this.configurationParams.SortOrder = $event
        if ($event !== '') {
          this.getList(this.configurationParams)
        }
      },
      onSortSelected ($event) {
        let noChange = this.sortBy === $event
        let selectedTabName = ProductTypes.getKey(this.selectedTab)
        sessionStorage.setItem(`SortBy_${selectedTabName}`, JSON.stringify($event))
        this.sortBy = $event
        // Set default sort on api call, but not if session storage is getting reset
        if (this.configurationParams.SortOrder == '' && $event !== '') {
          this.configurationParams.SortOrder = SortDirection.Ascending
          sessionStorage.setItem(`SortOrder_${selectedTabName}`, JSON.stringify(SortDirection.Ascending))
        } else if ($event === '') {
          this.configurationParams.SortOrder = ''
          sessionStorage.setItem(`SortOrder_${selectedTabName}`, JSON.stringify(SortDirection.Ascending))

        }
        this.configurationParams.SortBy = $event

        if (!noChange) {
          this.getList(this.configurationParams)
        }
      },
      onTabChanged ($event) {
        this.tabChanged = true
        this.$emit('update:selectedTab', $event)
      },
      selectProductType (id) {
        let productTypeKey = ProductTypes.getKey(id)
        this.configurationParams.ConfiguratorType = productTypeKey
        sessionStorage.setItem('ConfiguratorType', JSON.stringify(productTypeKey))

        // if attribute values are set in session storage, get them and apply to config params and selected attributes
        let attributeValues = JSON.parse(sessionStorage.getItem(`SelectedAttributes_${productTypeKey}`))
        if (attributeValues) {
          this.configurationParams.AttributeValues = attributeValues
          this.selectedAttributes = attributeValues
          if (this.selectedAttributes.length === 0 || this.configuratorList.length === 0) {
            // get the list with the updated config params
          }
        } else {
          // get the list with the updated config params
         //  this.getList(this.configurationParams, true)
        }
        let selectedTabName = ProductTypes.getKey(this.selectedTab)
        let sortBy = JSON.parse(sessionStorage.getItem(`SortBy_${selectedTabName}`))
        this.sortBy = sortBy
        this.configurationParams.SortBy = sortBy

        let sortOrder = JSON.parse(sessionStorage.getItem(`SortOrder_${selectedTabName}`))
        this.sortOrder = sortOrder
        this.configurationParams.SortOrder = sortOrder
        if (this.isResetDisabled) {
          this.getList(this.configurationParams, true)
        }

      },
      updatePage (pageValue) {
        this.configurationParams.CurrentPageNumber = pageValue.currentPage
        this.getList(this.configurationParams)
      },
      updateSelectedAttributes (configuratorList) {
        let selectedAttributes = []
        configuratorList.forEach(item => {
          let selectedItem
          if (item.selectedValueId != null && Array.isArray(item.selectedValueId)) {
            // return item.selectedValue.length > 0
            if (item.selectedValueId.length > 0) {
              selectedItem = item.ATTRIBUTE_VALUES.filter(listItem => item.selectedValueId.some(attribute => listItem.LINE_NO === attribute))
            }
          } else {
            // return  item.selectedValue != null
            if (item.selectedValueId != null) {
              selectedItem = [item.ATTRIBUTE_VALUES.find(listItem => listItem.LINE_NO === item.selectedValueId)]
            }
          }
          if (selectedItem) {
            selectedAttributes.push({
              ID: item.ID,
              ATTRIBUTE_ID: item.ATTRIBUTE_ID,
              ATTRIBUTE_VALUES: selectedItem,
              label: item.label,
              DISPLAY_TYPE: item.DISPLAY_TYPE,
              TYPE: item.TYPE,
              name: item.NAME
            })
          }
        })
        this.selectedAttributes = selectedAttributes
      },
      setAttributeList (configuratorList) {
        if (configuratorList) {
          let groups = []
          let attributes = []
          configuratorList.forEach(group => {

              // loop through each group to create attributes list
              group.GROUP_ATTRIBUTES.forEach(attribute => {

                let relatedSelectedFilter = this.selectedAttributes.find(item => {
                  return item.ID === attribute.ID && item.ATTRIBUTE_ID === attribute.ATTRIBUTE_ID
                })

                // Add selected Attributes value ids to attribute
                let id
                if (relatedSelectedFilter !== undefined && Array.isArray(attribute.ATTRIBUTE_VALUES)) {
                  id = attribute.DISPLAY_TYPE === AttributeTypes.Checkbox ? relatedSelectedFilter.ATTRIBUTE_VALUES.map(value => value.LINE_NO) : relatedSelectedFilter.ATTRIBUTE_VALUES.find(value => value !== undefined && value.LINE_NO !== undefined && value.LINE_NO !== null).LINE_NO
                } else if (relatedSelectedFilter !== undefined) {
                  id = relatedSelectedFilter.ATTRIBUTE_VALUES
                }

                let selectedValueId = id ? id : attribute.DISPLAY_TYPE === AttributeTypes.Checkbox ? [] : null

                // Create list of attributes to be tracked
                attributes.push({
                  ID: attribute.ID,
                  ATTRIBUTE_ID: attribute.ATTRIBUTE_ID,
                  ATTRIBUTE_VALUES: attribute.ATTRIBUTE_VALUES,
                  selectedValueId: selectedValueId,
                  label: attribute.CAPTION,
                  fieldType: attribute.DISPLAY_TYPE,
                  group: group.GROUP_NAME,
                  NAME: attribute.NAME
                })
              })

              // create groups for layout
              groups.push({
                title: group.DISPLAY_CAPTION,
                groupName: group.GROUP_NAME
              })
            })

          this.itemSelected = false
          this.configuratorGroups = groups
          this.attributeList = attributes
        }
      },
      onDeleteTag ($event) {
        this.attributeList.forEach(item => {
          if (item.ID === $event) {
            item.selectedValueId = null
          }
        })
        this.updateSelectedAttributes(this.attributeList)
      },
      /**
       * when the filter has been updated, updates the
       */
      onFilterSelected (e) {
        this.itemSelected = e != null
        if (this.itemSelected || e === 'is-checkbox') {
          this.updateSelectedAttributes(this.attributeList)
        }
        // this.itemSelected = false

      },
      /**
       * sets sessionStorage data for Configurator type and associated selected attributes
       */
      setSessionStorage (ConfiguratorType, selectedAttributes) {
        sessionStorage.setItem('ConfiguratorType', JSON.stringify(ConfiguratorType))
        if (selectedAttributes != null) {
          let key = `SelectedAttributes_${ConfiguratorType}`
          if (selectedAttributes.length > 0) {
            sessionStorage.setItem(key, JSON.stringify(selectedAttributes))
          } else {
            sessionStorage.setItem(key, JSON.stringify([]))
          }
        }
        this.checkResetDisabled()
      },
      /**
       * Get the attributes from session storage if they have been set
       * @param selectedParam
       */
      getSessionStorage (selectedParam) {
        let sortBy = JSON.parse(sessionStorage.getItem(`SortBy_${selectedParam}`))
        if (sortBy) {
          this.sortBy = sortBy
        } else {
          this.sortBy = this.sortOptions.length > 0 ? this.sortOptions[0].value : ''
        }

        let sortOrder = JSON.parse(sessionStorage.getItem(`SortOrder_${selectedParam}`))
        this.sortOrder = sortOrder
        this.configurationParams.SortOrder = sortOrder

        let selectedAttributes = JSON.parse(sessionStorage.getItem(`SelectedAttributes_${selectedParam}`))
        this.selectedAttributes = selectedAttributes || []
      },
      /**
       * Reset filters back to default
       * @param {Boolean} [clearOnReset=true] - Delete the session storage item before setting to default
       */
      onReset (clearOnReset = true) {
        SessionStorageKeys.forEach(key => {
          if (clearOnReset) {
            sessionStorage.removeItem(key)
            this.sortOrder = ''
            this.sortBy = ''
            this.configurationParams.SortOrder = ''
            this.configurationParams.SortBy = ''
            this.selectedAttributes = []
          }
          if (sessionStorage.getItem(key) === null) {
            let defaultValue = key.includes('SelectedAttributes_') ? [] : ''
            if (key === 'ConfiguratorType') {
              defaultValue = ProductTypes.getKey(this.selectedTab)
            }
            sessionStorage.setItem(key, JSON.stringify(defaultValue))
          }
        })
      },
      /**
       * checks sessionStorage for each tab type to see if it has associated filtering data
       * Sets isResetDisabled to true if any tab has associated session storage data
       */
      checkResetDisabled () {
        let hasSessionAttributes
        // loop through each one and check session storage to see if it has a value
        for (let i = 0; i < Object.keys(ProductTypes).length; i++) {
          let sessionValue = JSON.parse(sessionStorage.getItem(`SelectedAttributes_${ProductTypes.getKey(i)}`))
          // if it does, set to true and escape
          hasSessionAttributes = sessionValue != null && sessionValue.length > 0
          if (hasSessionAttributes) { break }
        }
        this.isResetDisabled = !hasSessionAttributes
      },
      onFindProductClick () {
        sessionStorage.setItem(ScrollToResults, JSON.stringify(true))

        window.location.href = this.configuratorResultsPage
      }
    },
    created () {
      this.onReset(false)
    },
    mounted () {
      let sessionType = JSON.parse(sessionStorage.getItem('ConfiguratorType'))
      if (sessionType == null) {
        this.configurationParams.ConfiguratorType = ProductTypes.getKey(ProductTypes.Casters)
        this.getList(this.configurationParams, true)
      } else {
        this.configurationParams.ConfiguratorType = sessionType
        this.getSessionStorage(sessionType)
      }

      // check to see if session data exists and set the reset status based on result
      this.checkResetDisabled()

    }
  }
</script>

<style lang="scss">
  @import "../../../assets/variables";

  $collapsedHeight: 9.5rem;
  $configBottomPadding: 1rem;

  .product-configurator-wrap {
    --wrapper-height: 100%;
    position: relative;
    z-index: 10;

    &.show-spinner {
      .filter-container {
        opacity: .8;
      }
      .spinner-box {
        z-index: 100;
        .circle-border {
          opacity: .8;
        }
      }
    }

    .product-configurator-inner {
      // transition: all .2s;
    }
    &.finder-expanded {
      @media screen and (min-width: $medium) {
        .product-configurator-inner {
          // max-height: 800px; // var(--wrapper-height);
          .utilities {
            .utilities-inner {
              padding-top: 0;
            }
          }
        }
      }
    }

    &.finder-collapsed {
      @media screen and (min-width: $medium) {
        // margin-bottom: $collapsedHeight + $configBottomPadding;
        .product-configurator-inner {
          background-color: $lightGreyBg;
          box-shadow: 1px -2px 24px 0px rgba(0, 0, 0, 0.62);
          -webkit-box-shadow: 1px -2px 24px 0px rgba(0, 0, 0, 0.62);
          -moz-box-shadow: 1px -2px 24px 0px rgba(0, 0, 0, 0.62);
          overflow: hidden;
          position: fixed;
          top: 77px;
          width: 100%;
          height: $collapsedHeight;
          max-height: $collapsedHeight;
          @media (min-width: 2000px) {
            padding: 0 10%;
          }

          > div {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          }

          .filter {
            width: 100%;
            padding-top: 0;
            min-height: 7.5rem;
          }

          .utilities {
            background-color: $lightGreyBg;

            .item-count {
              clear: both;
            }

            //.container,
            //.row,
            //.row > div {
            //  height: 100%;
            //}
            //
            //.utilities-inner {
            //  flex-direction: column;
            //  align-items: flex-end;
            //  padding-top: 1.25rem;
            //
            //  .sort-wrap {
            //    width: 18.825rem;
            //  }
            //
            //  .pagination.pager-wrapper {
            //    margin-right: .5rem;
            //    margin-top: .825rem;
            //    margin-bottom: 1.2rem;
            //  }
            //
            //  .item-count {
            //    position: absolute;
            //    margin-right: 300px;
            //    bottom: 1.8rem;
            //    text-align: right;
            //    width: 100%;
            //  }
            //
            //}
          }
        }
      }
    }

    .filter {
      background-color: $lightGreyBg;
      // margin-bottom: $configBottomPadding;
      min-height: 30rem;
      padding: 1rem .5rem 1rem;
      position: relative;

      @media screen and (min-width: $large)  {
        padding: 1.4rem 1rem 0rem;
      }

      .md-button {
        &.reset-button-filter {
          text-transform: unset;
          color: $primaryColor;
          text-decoration: underline;
          position: absolute;
          left: 0;
          bottom: .8rem;
          @media screen and (min-width: $large)  {
            bottom: -1.9rem;
          }
          z-index: 10;

          &:hover {
            background-color: transparent;
            color: $primaryColorHover;
            &::before {
              display:none;
            }
          }
        }
      }

    }

    .utilities {
      width: 100%;

      .container,
      .row,
      .row > div {
        height: 100%;
      }

      .utilities-container {
        display: flex;
        justify-content: flex-end;
      }

      .utilities-inner {
        flex-direction: column;
        align-items: flex-end;
        padding-top: 1.25rem;

        .sort-wrap {
          width: 18.825rem;
          float: right;
        }

        .pagination.pager-wrapper {
          margin-right: .5rem;
          margin-top: .825rem;
          margin-bottom: 1.2rem;
          float: right;
        }

        .item-count {
          text-align: right;
          float: left;
          padding-top: 1.15rem;
          font-size: 1.1rem;
          font-style: italic;
        }

      }


      //.utilities-inner {
      //  @media screen and (min-width: $small)  {
      //    display: flex;
      //    flex-direction: row;
      //    justify-content: space-between;
      //    align-items: center;
      //    padding-bottom: 0;
      //  }
      //  @media screen and (max-width: $x-large)  {
      //    padding-bottom: 3rem;
      //  }
      //
      //  .item-count {
      //    font-style: italic;
      //    justify-self: flex-start;
      //    flex: 1;
      //    font-size: 1.1rem;
      //    margin-left: .5rem;
      //
      //    @media screen and (max-width: $medium)  {
      //      text-align: center;
      //      position: relative;
      //      margin: 0;
      //    }
      //    @media screen and (max-width: $large)  {
      //      position: absolute;
      //      text-align: center;
      //      width: 100%;
      //      margin-top: 6.1rem;
      //    }
      //
      //  }
      //}
    }

  }

</style>
