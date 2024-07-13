<template>
  <md-empty-state v-if="error != null">
    <font-awesome-icon class="md-empty-state-icon" :icon="['fad', 'sad-tear']" />
    <strong class="md-empty-state-label">An error has occurred</strong>
    <p class="md-empty-state-description">
      <span>{{ error }}</span><br>Please try again later
    </p>
    <md-button @click="goHome"
               class="md-raised">
      Go Hamilton Home Page
    </md-button>
  </md-empty-state>
  <div v-else
       class="detail-table-wrap clear">
    <spinner class="spinner" v-show="showSpinner" />

    <div v-show="!showSpinner">
      <div class="table-meta-header">
        <div class="info">
          <h2>Available {{ headingText }}</h2> 
          <span class="simple-tab-video" v-if="headingText === 'Casters'">
               <a id="imageLink" v-on:click="openHelpVideo(headingText)">
              <template v-if="hasClickedCastersHelp !== '1'">
                <B>LEARN MORE:</b>&nbsp;<font-awesome-icon :icon="['fas', 'play-circle']"></font-awesome-icon>&nbsp;How to view product details
              </template>
              <template v-else>
                  <font-awesome-icon :icon="['fas', 'play-circle']"></font-awesome-icon>
              </template>
            </a>
          </span>
          <span  class="simple-tab-video" v-else-if="headingText === 'Wheels'">
            <a id="imageLink" v-on:click="openHelpVideo(headingText)">
              <template v-if="hasClickedWheelsHelp !== '1'">
                   <B>LEARN MORE:</b> &nbsp;<font-awesome-icon :icon="['fas', 'play-circle']" /> &nbsp;How to view product details
              </template>
              <template v-else>
                <font-awesome-icon class="md-empty-state-icon" :icon="['fas', 'play-circle']" />
              </template>
            </a>
          </span>
        </div>
        <div class="controls clearfix">
          <table-tabs v-if="typeOptions.length > 0"
                      :tabs="typeOptions"
                      :selected-tab="groupValue"
                      @change="onTypeChange" />
        

        </div>
        <vue-modality ref="helpvideocaster" hide-footer centered width="45vw" title="How to use Grid">
          <img src="/portals/0/Images/castergridvideo.webp" alt="Animated Caster Video">
        </vue-modality>
        <vue-modality ref="helpvideowheel" hide-footer centered width="45vw" title="How to use Grid">
          <img src="/portals/0/Images/wheelgridvideo.webp" alt="Animated Wheel Video">
        </vue-modality>

        <div class="tools">
          <div class="pronto-shipment">
            <span>
              <img title="24-48 Hour PRONTO® Shipment."
                   src="/portals/0/Support/images/star.png"
                   class="pronto-shipment-star img">
              = 24-48 Hour PRONTO® Shipment.
            </span>
            <a href="/Warranty">
              <font-awesome-icon class="pronto-shipment-star"
                                 :icon="['fas', 'shield-check']" /> = Hamilton’s Three Year Product Warranty.
            </a>
          </div>
        </div>
      </div>
      <!--      <detail-list-->
      <!--        v-if="isMobile"-->
      <!--        :table-rows="tableRows"-->
      <!--        :original-table-rows="originalTableRows"-->
      <!--        :empty-cols-length="emptyColsLength"-->
      <!--        :group-value="groupValue"-->
      <!--        :headers="headers"-->
      <!--        :hide-low-priority="hideLowPriority"-->
      <!--        :selected-group-option="selectedGroupOption"-->
      <!--        :base-part-details-url="basePartDetailsUrl" />-->
      <detail-card class="detail-card"
                   :table-rows="tableRows"
                   :original-table-rows="originalTableRows"
                   :empty-cols-length="emptyColsLength"
                   :group-value="groupValue"
                   :headers="headers"
                   :selected-group-option="selectedGroupOption"
                   :base-part-details-url="basePartDetailsUrl"
                   :sort-details.sync="sortDetails"
                   :wheel-type-list="wheelTypeInfo" />

      <detail-table class="detail-table"
                    :table-rows="tableRows"
                    :original-table-rows="originalTableRows"
                    :empty-cols-length="emptyColsLength"
                    :group-value="groupValue"
                    :headers="headers"
                    :selected-group-option="selectedGroupOption"
                    :base-part-details-url="basePartDetailsUrl"
                    :sort-details.sync="sortDetails"
                    :wheel-type-list="wheelTypeInfo" />
    </div>
  </div>
 
   
 
</template>

<script>
import { getListAPI } from '../../api'
import DetailTable from './DetailTable'
import utilities from '../../utilities/helpers'
import {SortDirection} from '../enums'
import TableTabs from '../Utilities/TableTabs'
import Spinner from '../Utilities/Spinner'
import DetailCard from './DetailCard'
import VueModality from 'vue-modality'
import VueCookies from 'vue-cookies'

 export default {
  name: 'product-details',
  components: {
    DetailCard,
    Spinner,
    TableTabs,
    DetailTable,
    VueModality,
    VueCookies
  },
  props: {
    moduleId: {
      type: String
    },
    commodityId: {
      type: [Number, String]
    },
    detailLink: {
      type: [Number, String]
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
        path: "AcuitiSolutions/CatalogGrid",
        controller: 'ItemController'
      },
      antiForgery: null,
      moduleService: {},
      // Component Items
      basePartDetailsUrl: null,
      gridDetails: {},
      headers: [],
      hideLowPriority: true,
      isMobile: true,
      emptyColsLength: 0,
      filterLabel: null,
      filterList: [],
      filterProperty: null,
      groupValue: '',
      headingText: null,
      productFilter: {
        filterLabel: null,
        filterProperty: null,
        filterList: []
      },
      originalTableRows: [],
      selectedFilter: null,
      selectedGroupOption: {},
      showSpinner: true,
      sortDetails: {
        direction: null,
        sortIndex: null
      },
      tableRows: [],
      typeOptions: [],
      wheelTypeInfo: null,
      error: null,
      hasClickedCastersHelp: $cookies.get('hasClickedCasterGridVideo'),
      hasClickedWheelsHelp: $cookies.get('hasClickedWheelGridVideo')
    }
  },
  computed: {
  },
  watch: {
    sortDetails: {
      handler: function ({direction, sortIndex, propName}) {
        let tableRows = JSON.parse(JSON.stringify(this.tableRows))
        if (direction === null) {
          tableRows = this.originalTableRows
        } else {
          let sortParam = direction === SortDirection.Descending ? propName : `-${propName}`
          tableRows.sort(utilities.dynamicSort(sortParam, 1, false, true))

        }
        if (this.selectedFilter !== '' && this.selectedFilter != null) {
          tableRows = tableRows.filter(row => row[this.productFilter.filterProperty] === this.selectedFilter)
        }
        this.tableRows = tableRows
      },
      deep: true
    }
  },
  methods: {
    getList () {
      getListAPI(this.commodityId, this.detailLink)
      .then(res => {
        this.gridDetails = res
        this.basePartDetailsUrl = res.BasePartDetailsURL
        this.wheelTypeInfo = res.WheelTypeInfo
        this.headingText = res.WheelTypeInfo.length > 1 ? 'Casters' : 'Wheels'
        let bearingType = res.BearingType || null
        this.buildHeaders(res.GridHeaderInfo, bearingType)
        this.buildRows(res.GridPartsInfo)
        this.showSpinner = false;
       //let prodFamily = res.WheelTypeInfo.length > 1 ? 'Casters' : 'Wheels';
        
      })
      .catch(err => this.error = err)
    },
    buildHeaders (gridHeaderInfo, bearingTypes) {
      gridHeaderInfo.forEach(header => {
        header.propName = `${header.FieldIndexPosition}_${header.FieldName}`
      })
      this.headers = gridHeaderInfo.sort((a, b) => a.FieldIndexPosition - b.FieldIndexPosition)
      this.buildOptionsList(bearingTypes)
    },
    buildOptionsList (bearingTypes) {
      let optionsList = []
      this.headers.forEach(header => {
        if (header.FieldBanner !== '') {
          optionsList.push(header.FieldBanner)
        }
        header.FieldProperty = header.propName
      })
      let updatedList = [...new Set(optionsList)]
      let objectsList = []
      updatedList.forEach((option) => {
        objectsList.push({
          name: option,
          value: option,
          cols: this.getColsLength(option),
          tabData: bearingTypes != null ? bearingTypes.find(type => type.BearingType === option) : null
        })
      })
      this.groupValue = objectsList.length > 0 ? objectsList[0].value : ''
      this.typeOptions = objectsList
      this.getEmptyColsLength()
    },
    getColsLength (option) {
      let filteredHeaders = this.headers.filter(header => header.FieldBanner === option)
      return filteredHeaders != null ? filteredHeaders.length : 0
    },
    getEmptyColsLength () {
      let index = 0
      for (let i = 0; i < this.headers.length; i++) {
        if (this.headers[i].FieldBanner === '') {
          index++
        } else {
          break
        }
      }
      this.emptyColsLength = index
    },
    buildRows (gridPartsInfo) {
      this.tableRows = []
      gridPartsInfo.forEach(row => {
        let rowValue = {
          partId: row.BasePartID
        }
        row.FieldInfo.forEach(field => {
          let propName = `${parseInt(field.FieldPosition)}_${field.FieldName}`
          rowValue[propName] = field.FieldValue
        })
        this.tableRows.push(rowValue)
      })
      this.originalTableRows = JSON.parse(JSON.stringify(this.tableRows))
      this.selectedGroupOption = this.typeOptions.find(option => option.value === this.groupValue)
      this.getFilters()
    },
    onTypeChange ($event) {
      this.groupValue = $event
      this.selectedGroupOption = this.typeOptions.find(option => option.value === $event)
    },
    onFilterChange (filterValue) {
      if (filterValue !== '') {
        this.tableRows = this.originalTableRows.filter(row => row[this.productFilter.filterProperty] === filterValue)
      } else {
        this.tableRows = this.originalTableRows
      }
      if (this.sortDetails.propName != null) {
        let sortParam = this.sortDetails.direction === SortDirection.Descending ? this.sortDetails.propName : `-${this.sortDetails.propName}`
        this.tableRows.sort(utilities.dynamicSort(sortParam, 1, true))
      }

    },
    getFilters () {
      this.productFilter = []
      // let filterLabel = null
      // let filterProperty = null
      // let filterList = []
      let productFilter = {
        filterLabel: null,
        filterProperty: null,
        filterList: []
      }
      // TODO: Temporary to get a filter value
      let filterColumn = this.headers.find(header => header.IsFilterColumn)
      // let filterColumn = this.headers.find(header => header.IsFilterColumn)
      if (filterColumn != null) {
        productFilter.filterLabel = filterColumn.FieldCaption
        productFilter.filterProperty = filterColumn.propName
        let filterValues = []
        this.originalTableRows.forEach(row => {
          filterValues.push(row[filterColumn.propName])
        })
        productFilter.filterList = [...new Set(filterValues)]
      } else {
        productFilter.filterLabel = null
        productFilter.filterProperty = null
      }
      // this.$emit('update:filterLabel', filterLabel)
      // this.$emit('update:filterProperty', filterProperty)
      // this.$emit('update:filterList', filterList)
      this.productFilter = productFilter
    },
    goHome () {
      window.location.href = '/'
    },
    openHelpVideo(productFamily) {
      //console.log(productFamily);
      // console.log($refs.helpvideo);
      if (productFamily === 'Casters') {
        if (!$cookies.get('hasClickedCasterGridVideo')) {
            $cookies.set('30d', '', '', true)
                       .set('hasClickedCasterGridVideo', '1');
        }
     
        this.$refs.helpvideocaster.open();
      }
      if (productFamily === 'Wheels') {
        if (!$cookies.get('hasClickedWheelGridVideo')) {
             $cookies.set('30d', '', '', true)
                       .set('hasClickedWheelGridVideo', '1');
        }
        this.$refs.helpvideowheel.open();
      }
     
    },
  },
  created () {
    this.moduleService[`svc-${this.moduleId}`] = this.svc
    this.getList()
    
  },
  mounted () {
  }
}
</script>

<style lang="scss">
  @import "../../assets/variables";
  .hc_howtovideolink{
  padding:5px;
  position:relative;
  top:15px;
  font-weight:bold;
  }
  .table-meta-header {
    margin-bottom: .5rem;

    > div {
      display: flex;
      flex-direction: column;

      @media screen and (min-width: $large) {
        flex-direction: row;
      }

      &.info {
        padding-top: 1rem;

        @media screen and (min-width: $large) {
          padding-top: unset;
          flex-direction: row;
        }
      }

      &.controls {
        display: block;
        align-items: center;
        justify-content: space-between;
        border-bottom: 2px solid $borderColor;

        .button-group {
          margin-right: 3rem;
          float: left;
        }
      }
     
    }

    .tools {
      display: flex;
      flex-direction: column;
      padding-top: 1.4rem;
      padding-bottom: 1.4rem;
      margin-top: .5rem;

      @media screen and (min-width: $large) {
        margin-top: 1rem;
        justify-content: flex-end;
        padding-top: unset;
        padding-bottom: unset;
        flex-direction: row;
      }

      .filter {
        float: right;
        display: flex;
        align-items: center;
        margin-bottom: .6rem;
        margin-top: 1rem;

        @media screen and (min-width: $large) {
          margin-top: unset;
          margin-left: 2rem;
        }

        > span {
          display: inline-block;
          padding-right: 1rem;
          white-space: nowrap;
        }

        .md-field {
          width: calc(100% - 3rem);

          @media screen and (min-width: $medium) {
            width: calc(100% - 4rem);
          }

          border: 1px solid $borderColor;
          background-color: $white;
          padding: 0;
          margin: 0;
          min-height: 3rem;
          max-width: 15rem;

          .md-menu.md-select {
            border: 1px solid $borderColor;
          }

          label {
            left: 1rem;
            top: 0.8125rem;
          }

          &.md-focused label,
          &.md-has-value label {
            top: .015rem;
          }

          .md-icon {
            height: 1.5rem;
          }

          input,
          textarea {
            margin-bottom: .3rem;
            padding: 1.5rem 1rem 0.6rem
          }

          &.md-theme-default:before,
          &.md-theme-default:after {
            display: none;
          }

          > .md-checkbox {
            padding: 12px 16px 0px 0;
            margin: unset;

            .md-checkbox-container {
              left: 1rem;

              &:before {
                height: 2rem;
              }

              .md-ripple {
                height: 40.8px !important;
              }
            }

            .md-checkbox-label {
              top: unset;
            }
          }
        }

        label {
          span {
            br {
              content: ' ';

              &:after {
                content: ' ';
              }
            }
          }
        }
      }
    }
  }

  .pronto-shipment {
    justify-self: flex-end;
    color: $primaryColor;
    display: flex;
    flex-direction: column;
    min-width: 300px;
    align-self: end;
    padding-left: 2rem;
    @media screen and (min-width: $large) {
      flex-direction: row;
    }
    > span {
      margin-right: .5rem;
    }
  }

  .detail-table-wrap {
    min-height: 30rem;
  }
  
  .detail-table {
    display: none;
  }
  .detail-card {
    display: block;
  }
  .simple-tab-video {
    color: rgb(248, 4, 4);
    display: flex;
    justify-content: center; /* Align horizontal */
    align-items: center; /* Align vertical */
    padding:19px;
  }

  @media screen and (min-width: $medium) {
    .detail-table {
      display: block;
    }
    .detail-card {
      display: none;
    }
  }

</style>
