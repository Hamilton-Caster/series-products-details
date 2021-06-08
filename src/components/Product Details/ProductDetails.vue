<template>
  <div>
    <div class="table-meta-header">
      <div class="info">
        <p class="toggle-button-label">Select 'Swivel Caster' or 'Rigid Caster' then click on desired model number to see more details.</p>
        <span class="pronto-shipment">
          <font-awesome-icon
            class="pronto-shipment-star"
            :icon="['fas', 'star']" /> = 24-48 Hour PRONTO® Shipment.</span>
      </div>
      <div class="controls">
        <checkbox-button-group
          :options="typeOptions"
          :selected-value="groupValue"
          @change="onTypeChange"/>
        <div class="filter" v-if="productFilter.filterList && productFilter.filterList.length > 0">
          <label>
            <span
              v-html="productFilter.filterLabel"></span>:
            <select
              v-model="selectedFilter"
              @change="onFilterChange">
              <option :value="null">Filter</option>
              <option
                v-for="option in productFilter.filterList"
                :key="option"
                :value="option">{{ option }}</option>
            </select>
          </label>
        </div>
      </div>
    </div>
    <detail-list
      v-if="isMobile"
      :table-rows="tableRows"
      :original-table-rows="originalTableRows"
      :empty-cols-length="emptyColsLength"
      :group-value="groupValue"
      :headers="headers"
      :selected-group-option="selectedGroupOption"
      :base-part-details-url="basePartDetailsUrl"
      :product-filter.sync="productFilter"/>
    <detail-table
      v-else
      :table-rows="tableRows"
      :original-table-rows="originalTableRows"
      :empty-cols-length="emptyColsLength"
      :group-value="groupValue"
      :headers="headers"
      :selected-group-option="selectedGroupOption"
      :base-part-details-url="basePartDetailsUrl"
      :product-filter.sync="productFilter"
      :sort-details.sync="sortDetails" />
  </div>
</template>

<script>
import {getListAPI} from '../../api'
import CheckboxButtonGroup from '../Utilities/CheckboxButtonGroup'
import DetailTable from './DetailTable'
import DetailList from './DetailList'
import utilities from '../../utilities/helpers'
import {SortDirection} from '../enums'

export default {
  name: 'product-details',
  components: {DetailTable, DetailList, CheckboxButtonGroup},
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
      isMobile: false,
      tableRows: [],
      originalTableRows: [],
      typeOptions: [],
      groupValue: null,
      emptyColsLength: 0,
      selectedGroupOption: {},
      filterList: [],
      filterLabel: null,
      selectedFilter: null,
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
      handler: function ({direction, sortIndex, fieldName}) {
        let tableRows = JSON.parse(JSON.stringify(this.tableRows))
        console.log('handler :: direction, sortIndex, fieldName', direction, sortIndex, fieldName)
        if (direction === null) {
          tableRows = this.originalTableRows
        } else {
          console.log('handler :: ', fieldName)
          let sortParam = direction === SortDirection.Descending ? fieldName : `-${fieldName}`
          tableRows.sort(utilities.dynamicSort(sortParam))

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
      })
    },
    buildHeaders (gridHeaderInfo) {
      this.headers = gridHeaderInfo.sort((a, b) => a.FieldIndexPosition - b.FieldIndexPosition)
      this.buildOptionsList()
    },
    buildOptionsList () {
      let optionsList = []
      this.headers.forEach(header => {
        if (header.FieldBanner !== '') {
          optionsList.push(header.FieldBanner)
        }
        header.FieldProperty = header.FieldName
      })
      let updatedList = [...new Set(optionsList)]
      let objectsList = []
      updatedList.forEach(option => {
        objectsList.push({
          text: option,
          value: option,
          cols: this.getColsLength(option)
        })
      })
      this.groupValue = objectsList.length > 0 ? objectsList[0].value : null
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

          rowValue[field.FieldName] = field.FieldValue
        })
        this.tableRows.push(rowValue)
      })
      this.originalTableRows = JSON.parse(JSON.stringify(this.tableRows))
      this.selectedGroupOption = this.typeOptions.find(option => option.value === this.groupValue)

    },
    onTypeChange ($event) {
      this.groupValue = $event
      this.selectedGroupOption = this.typeOptions.find(option => option.value === $event)
    },
    onFilterChange ($event) {
      let filterValue = $event.target.value
      if (filterValue !== '') {
        this.tableRows = this.originalTableRows.filter(row => row[this.productFilter.filterProperty] === filterValue)
      } else {
        this.tableRows = this.originalTableRows
      }
      console.log('onFilterChange :: $event', $event)
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
    margin-bottom: 2rem;
    > div {
      display: flex;
      flex-direction: row;
      &.info {
        justify-content: space-between;
      }
      &.controls {
        align-items: center;
        .button-group {
          margin-right: 3rem;
        }
        .filter {
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
  }

</style>
