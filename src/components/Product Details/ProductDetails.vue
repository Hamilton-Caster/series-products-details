<template>
  <div class="detail-table-wrap clear">
    <spinner class="spinner" v-show="showSpinner" />
    <div v-show="!showSpinner">
      <div class="table-meta-header">
        <div class="info">
          <p class="toggle-button-label">
            Select 'Swivel Caster' or 'Rigid Caster' then click on desired model number to see more details.
          </p>
          <div class="pronto-shipment">
            <span>
              <font-awesome-icon
                class="pronto-shipment-star"
                :icon="['fas', 'star']" /> = 24-48 Hour PRONTO® Shipment.</span>
            <a href="/Warranty">
              <font-awesome-icon
                class="pronto-shipment-star"
                :icon="['fas', 'shield-check']" /> = Hamilton’s Three Year Product Warranty.</a>
          </div>
        </div>
        <div class="controls clearfix">
          <table-tabs
            v-if="typeOptions.length > 0"
            :tabs="typeOptions"
            :selected-tab="groupValue"
            @change="onTypeChange" />
          <div class="filter" v-if="productFilter.filterList && productFilter.filterList.length > 0">
            <span>Filter by: </span>
            <md-field class="table-filter">
              <label
                for="tableFilter"
                v-html="productFilter.filterLabel"></label>
              <md-select
                md-dense
                v-model="selectedFilter"
                @md-selected="onFilterChange"
                name="tableFilter">
                <md-option value="">
                  &nbsp;<span v-html="`Select ${productFilter.filterLabel}`"></span>
                </md-option>
                <md-option
                  v-for="option in productFilter.filterList"
                  :key="option"
                  :value="option">
                  {{ option }}
                </md-option>
              </md-select>
            </md-field>
            <!--          <label>-->
            <!--            <span-->
            <!--              v-html="productFilter.filterLabel"></span>:-->
            <!--            <select-->
            <!--              v-model="selectedFilter"-->
            <!--              @change="onFilterChange">-->
            <!--              <option :value="null">Filter</option>-->
            <!--              <option-->
            <!--                v-for="option in productFilter.filterList"-->
            <!--                :key="option"-->
            <!--                :value="option">{{ option }}</option>-->
            <!--            </select>-->
            <!--          </label>-->
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
      <detail-card
        class="detail-card"
        :table-rows="tableRows"
        :original-table-rows="originalTableRows"
        :empty-cols-length="emptyColsLength"
        :group-value="groupValue"
        :headers="headers"
        :selected-group-option="selectedGroupOption"
        :base-part-details-url="basePartDetailsUrl"
        :sort-details.sync="sortDetails"
        :wheel-type-list="wheelTypeInfo" />

      <detail-table
        class="detail-table"
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
import {getListAPI} from '../../api'
import DetailTable from './DetailTable'
import utilities from '../../utilities/helpers'
import {SortDirection} from '../enums'
import TableTabs from '../Utilities/TableTabs'
import Spinner from '../Utilities/Spinner'
import DetailCard from './DetailCard'

export default {
  name: 'product-details',
  components: {
    DetailCard,
    Spinner,
    TableTabs,
    DetailTable
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
      tableRows: [],
      originalTableRows: [],
      typeOptions: [],
      groupValue: '',
      emptyColsLength: 0,
      selectedGroupOption: {},
      filterList: [],
      filterLabel: null,
      selectedFilter: null,
      showSpinner: true,
      sortDetails: {
        direction: null,
        sortIndex: null
      },
      filterProperty: null,
      productFilter: {
        filterLabel: null,
        filterProperty: null,
        filterList: []
      },
      wheelTypeInfo: null
    }
  },
  computed: {
  },
  watch: {
    sortDetails: {
      handler: function ({direction, sortIndex, propName}) {
        let tableRows = JSON.parse(JSON.stringify(this.tableRows))
        console.log('handler :: direction, sortIndex, propName', direction, sortIndex, propName)
        if (direction === null) {
          tableRows = this.originalTableRows
        } else {
          console.log('handler :: ', propName)
          let sortParam = direction === SortDirection.Descending ? propName : `-${propName}`
          tableRows.sort(utilities.dynamicSort(sortParam, 1, true))

        }
        console.log('handler :: this.selectedFilter', this.selectedFilter)
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
        this.buildHeaders(res.GridHeaderInfo)
        this.buildRows(res.GridPartsInfo)
        this.showSpinner = false
      })
    },
    buildHeaders (gridHeaderInfo) {
      gridHeaderInfo.forEach(header => {
        header.propName = `${header.FieldIndexPosition}_${header.FieldName}`
      })
      this.headers = gridHeaderInfo.sort((a, b) => a.FieldIndexPosition - b.FieldIndexPosition)
      this.buildOptionsList()
    },
    buildOptionsList () {
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
          cols: this.getColsLength(option)
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

      console.log('onFilterChange :: $event', filterValue)
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
    }
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

  .table-meta-header {
    margin-bottom: .5rem;

    > div {
      display: flex;
      flex-direction: row;
      @media screen and (min-width: $large)  {
        flex-direction: row;
      }
      &.info {
        justify-content: space-between;
        flex-direction: column;
        padding-top: 1rem;
        @media screen and (min-width: $large)  {
          padding-top: unset;
          flex-direction: row;
        }
      }
      &.controls {
        display: block;
        align-items: center;
        justify-content: space-between;
        border-bottom: 2px solid $borderColor;
        margin-top: 1.5rem;

        .button-group {
          margin-right: 3rem;
          float: left;
        }
        .filter {
          float: right;
          margin-left: 4rem;
          display: flex;
          align-items: center;
          margin-bottom: .6rem;
          > span {
            display: block;
            padding-right: 1rem;
            white-space: nowrap;
          }

          .md-field {
            width: calc(100% - 3rem);
            @media screen and (min-width: $medium)  {
              width: calc(100% - 4rem);
            }
            border: 1px solid $borderColor;
            background-color: $white;
            padding: 0;
            margin: 0;
            min-height: 3rem;
            max-width: 15rem;

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
            &.md-theme-default:after{
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
      .toggle-button-label {
      }
    }
  }

  .pronto-shipment {
    justify-self: flex-end;
    color: $primaryColor;
    display: flex;
    flex-direction: column;
    min-width: 300px;
  }

  .detail-table-wrap {
    min-height: 30rem;
  }
  .spinner {
  }
  .detail-table {
    display: none;
  }
  .detail-card {
    display: block;
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
