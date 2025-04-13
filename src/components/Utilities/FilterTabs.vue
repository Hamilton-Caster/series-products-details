<template>
  <div class="filter-tabs">
    <md-tabs 
      :md-active-tab="selectedTab"
      @md-changed="onTabChanged">
      <template 
        slot="md-tab"
        slot-scope="{ tab }">
        <div 
          v-if="tab.data.tabData != null" 
          class="thumb-tab">
          <div class="img-wrap" v-if="tab.data.tabData.ImageURL">
            <img 
              class="thumb-img"
              :src="tab.data.tabData.ImageURL"
              :alt="getTabTitle(tab)">
          </div>
        
          <div :class="hasSelectedFilterIconOption(tab)">
           <!--  <font-awesome-icon :icon="['fas', 'caret-right']" />
            <font-awesome-icon :icon="['fas', 'caret-down']" />
            <font-awesome-icon :icon="['fas', 'check-circle']" /> -->
            <font-awesome-icon :icon="['fas', hasSelectedCaratOption(tab)]" />
          </div>
          <div :class="hasSelectedFilterTitleOption(tab)">
            <h3 :class="hasSelectedFilterOptions(tab)" v-html="getTabTitle(tab)"></h3>
            <p v-if="tab.data.tabData.Description" v-html="tab.data.tabData.Description"></p>
          </div>
        </div>
        <div v-else class="simple-tab-title">
          {{ getTabTitle(tab) }}
        </div>
      </template>
      <md-tab 
        v-for="tab in tabs"
        :key="tab.CommodityAttributeID"
        :id="tab.Name"
        :md-label="tab.Caption"
        :md-template-data="{ tabData: tab.FilterValues}"
        :md-ripple="false">
        <div :class="checkActiveFilterTab(tab.Name)">
          <div 
            v-for="item in tab.FilterValues" 
            :key="item.FilterValue" 
            class="filter-tabContentItem" 
            style="cursor:pointer">
            <figure>
              <img 
                :class="checkSelectedFilterValue(item.FilterName, item.FilterValue)"
                :src="item.ImageFile"
                :alt="item.FilterValue"
                :filtergroupid="item.FilterName"
                :filtervalue="item.FilterValue"
                @click.stop="toggleFilterSelection(item.FilterName, item.FilterValue)">
              <figcaption><span v-html="formatFilterValue(item.FilterName, item.FilterValue)"></span></figcaption> 
              <!--<figcaption><span v-html="item.FilterValue"></span></figcaption>-->
            </figure>
          </div>
        </div>
      </md-tab>
    </md-tabs>
  </div>
</template>

<script>
  export default {
    name: 'filter-tabs',
    props: {
      selectedTab: {
        type: String
      },
      disableResetButton: {
        type: Boolean,
        default: true
      },
      tabs: {
        type: Array,
        default: () => []
      },
      headerRows: {
        type: Array,
        default: () => []
      },
      selectedFilterValues: {
        type:Array,
        default: () => []
      }
    },
    data: () => ({ activeFilterTab: ''}),
    computed: {
      
    },
    methods: {
      onTabChanged (id) {
        this.activeFilterTab = id;
        //console.log("Changing Tab" + id);
        if (this.selectedTab !== id) {
          this.$emit('toggle-active', id);
          
          
        }
      },
      onReset () {
        this.$emit('reset-filter')
      },
      getTabTitle (tab) {
        //console.log(this.selectedFilterValues);
        return  tab.data.tabData && tab.data.tabData.Title ?  tab.data.tabData.Title  : tab.label 
      },
      getTabFilters (tab){
        //console.log(tab.data.tabData);
      },
      toggleFilterSelection: function(filterName, filterValue) {
        var self = this;
        var tempList = [...new Set(self.selectedFilterValues)];
        console.log(tempList);
        tempList.forEach((selectedfilter,index) =>{
           //First filter is not allowed to have multiple values. Every other filter can have multiple values. 
           if(index === 0)
           {
               if(selectedfilter.filterName === filterName)
               {
                selectedfilter.filterValues.forEach((selectedFilterValue, index) =>{
                  if(selectedFilterValue.fValue === filterValue)
                  {
                    selectedFilterValue.selected = true;
                  }
                  else{
                    selectedFilterValue.selected = false;
                  }
                })
               }
           }
           else{
              if(selectedfilter.filterName === filterName)
              {
                  selectedfilter.filterValues.forEach((selectedFilterValue, index) =>{
                        if(selectedFilterValue.fValue === filterValue)
                        {
                          if(selectedFilterValue.selected)
                          {
                            selectedFilterValue.selected = false;
                            return;
                          }
                          else{
                            selectedFilterValue.selected = true;
                            return;
                          }
                        }
                       
                      });
                  return;
              }
           }
           
        });
        self.selectedFilterValues = tempList;
        this.$emit('change', self.selectedFilterValues);
      },
      changeSelectedCarat: function(tabID) {
          console.log("toggleCarat");
      },
      hasSelectedFilterOptions: function (tabName){
        var defaultClass = "thumb-tab-heading";
        var self = this;
        //console.log(tabName.data.tabData[0].FilterName);
        //console.log(self.selectedFilterValues);
        var tempList = [...new Set(self.selectedFilterValues)];
         tempList.forEach((selectedfilter,index) =>{
            if(selectedfilter.filterName === tabName.data.tabData[0].FilterName)
            {
              selectedfilter.filterValues.forEach((selectedFilterValue, index) =>{
                if(selectedFilterValue.selected)
                {
                  defaultClass = "thumb-tab-heading_hasItems";
                  //console.log("FoundItemSelected");
                  return;
                }
                 
                })
              return;
            }
         });
        return defaultClass;
      },
      hasSelectedCaratOption: function (tabName){
        var defaultClass = "caret-right";
        //console.log(tabName.label);
        var self = this;
       //console.log(self.selectedTab);
       //console.log(tabName);
       //console.log("ActiveTab-" + self.activeFilterTab);
       if(tabName.data.tabData[0].FilterName === self.activeFilterTab)
       {
          defaultClass = "caret-down";
       }
       else{
        //if it's not active tab then check if it contains items.
        var tempList = [...new Set(self.selectedFilterValues)];
        tempList.forEach((selectedfilter,index) =>{
          if(selectedfilter.filterName === tabName.data.tabData[0].FilterName)
          {
            selectedfilter.filterValues.forEach((selectedFilterValue, index) =>{
              if(selectedFilterValue.selected)
              {
                defaultClass = "check-circle";
                //console.log("FOUND ITEM");
                return;
              }
                
            })
            return;
          }
        });
       }
       return defaultClass;
      },
      hasSelectedFilterIconOption: function(tabName){
        var defaultClass = "filterIcon";
        //console.log(tabName.label);
        var self = this;
       //console.log(self.selectedTab);
       //console.log(tabName);
       //console.log("ActiveTab-" + self.activeFilterTab);
       if(tabName.data.tabData[0].FilterName === self.activeFilterTab)
       {
          defaultClass = "filterIcon";
       }
       else{
        //if it's not active tab then check if it contains items.
        var tempList = [...new Set(self.selectedFilterValues)];
        tempList.forEach((selectedfilter,index) =>{
          if(selectedfilter.filterName === tabName.data.tabData[0].FilterName)
          {
            selectedfilter.filterValues.forEach((selectedFilterValue, index) =>{
              if(selectedFilterValue.selected)
              {
                defaultClass = "filterIconGrayedOut";
                //console.log("FOUND ITEM");
                return;
              }
                
            })
            return;
          }
        });
       }
       return defaultClass;
      },
      hasSelectedFilterTitleOption: function(tabName){
        var defaultClass = "thumb-text";
        //console.log(tabName.label);
        var self = this;
       //console.log(self.selectedTab);
       //console.log(tabName);
       //console.log("ActiveTab-" + self.activeFilterTab);
       if(tabName.data.tabData[0].FilterName === self.activeFilterTab)
       {
          defaultClass = "thumb-text";
       }
       else{
        //if it's not active tab then check if it contains items.
        var tempList = [...new Set(self.selectedFilterValues)];
        tempList.forEach((selectedfilter,index) =>{
          if(selectedfilter.filterName === tabName.data.tabData[0].FilterName)
          {
            selectedfilter.filterValues.forEach((selectedFilterValue, index) =>{
              if(selectedFilterValue.selected)
              {
                defaultClass = "thumb-textGrayedOut";
                //console.log("FOUND ITEM");
                return;
              }
                
            })
            return;
          }
        });
       }
       return defaultClass;
      },
      checkActiveFilterTab: function (currentFilter) {
        var self = this;
        //console.log(currentFilter);
        //console.log(this.activeFilterTab);
        if(currentFilter === self.activeFilterTab)
        {
            return "filter-tabContentActive";
        }
        else{
            return "filter-tabContent";
        }
      },
      checkSelectedFilterValue: function(filterName, filterValue){

        var cssImageClass = "filter-thumb-img";
        var self = this;
        //console.log(self.selectedFilterValues);
        self.selectedFilterValues.forEach((selectedfilter, index) =>{
          //console.log("FN" +filterName);
          //console.log("FV" + filterValue);
          if(selectedfilter.filterName === filterName) 
          {
            //console.log(selectedfilter.filterValues);
            selectedfilter.filterValues.forEach((filteredValue, index) =>{
                if(filteredValue.fValue === filterValue && filteredValue.selected)
                {
                   cssImageClass = "filter-thumb-imgActive";
                   return;
                }
            }); 
            return;
          }
        
         
        })
        return cssImageClass;
      },
      formatFilterValue: function(filterName, filterValue){
        //console.log(filterValue);
        var self = this;
        const filterHeader = self.headerRows.find(field => field.FieldName === filterName);
        if(filterHeader){
          //console.log(filterHeader);
          if(filterHeader.IsFractionColumn)
          {
            const convertedValue = this.convertToFraction(filterValue);
            //console.log("COnverted", convertedValue);
            return convertedValue;
          }
        }
        return filterValue;
      },
      convertToFraction (value) {
      let amp = '@'
      let hasPronto = value.slice(value.length - 1) === amp
      if (hasPronto) {
        value = value.replaceAll('@', '')
      }

      let fractionCheck = /(\d+)\/(\d+)$/g
      // Check to see if value contains a fraction
      if (value.match(fractionCheck)) {
        // Split the value between whole number and fraction
        let numberArray = value.split(' ')
        numberArray.forEach((fraction, index) => {
          // check each segment to see if it is the fraction.
          if (fraction.match(fractionCheck)) {
            // if this is the fraction, split it at the "/"
            let fractionArray = fraction.split('/')
            // convert the fractional value to formatted html
            let formattedFraction = `<sup>${fractionArray[0]}</sup>&frasl;<sub>${fractionArray[1]}</sub>`
            // if this is not the first number, rejoin whole number and formatted fraction, otherwise return formatted fraction
            value = index > 0 ? `${numberArray[0]} ${formattedFraction}` : formattedFraction
          }
        })
      }
      if (hasPronto) {
        value = `${value}@`
      }

      return value
    },
    

    },
    created () {

    },
    mounted () {

    }
  }
</script>

<style lang="scss">
@import "../../assets/variables";

  .filter-tabs {
    // Tabs
    --tab-font-size: 1.25rem;
    @media screen and (min-width: $medium)  { --tab-font-size: 1rem; }
    @media screen and (min-width: $large)  { --tab-font-size: 1.25rem; }
    @media screen and (min-width: $x-large)  { --tab-font-size: 1.5rem; }
    @media screen and (min-width: $xxx-large)  { --tab-font-size: 2rem; }
    $tabFontSize:         var(--tab-font-size);

    $tabFontColor:        $black;
    $tab_normalOpacity:   .83;
    $tab_hoverOpacity:    .93;
    $tab_selectedOpacity: 1;

    position: relative;
    float: right;
    @media screen and (min-width: $small) {
      margin-top: 0.75rem;
      margin-bottom: -0.1rem;
    }

    .md-tabs {
      z-index: 1;
      &.md-theme-default {
        .md-tabs-navigation {
          background-color: transparent;
          border-bottom: 1px solid $borderColor;
          //padding-bottom: .3rem;
          @media screen and (max-width: $large)  {
            flex-direction: column;
            .md-ripple {
              justify-content: right;
            }
          }

          .md-button {
            font-size: $tabFontSize;
            color: $primaryColor;
            opacity: $tab_normalOpacity;
            text-transform: none;
            margin-right: 0;
            transition: opacity .2s;
            line-height: 2rem;
            max-width: 24rem;
            height: auto;
            min-height: 2rem;

            .md-ripple {
              align-items: flex-start;
              @media screen and (min-width: $large) and (max-width: $x-large) {
                padding: 0 .5rem;
              }
            }

            .thumb-tab {
              display: flex;
              flex-direction: row;
              align-items: end;

              .img-wrap {
                @media screen and (min-width: $large) and (max-width: $xx-large) {
                  display: none;
                }
                width: 6.25rem;
                height: 6.25rem;

                .thumb-img {
                  max-width: 6.25rem;
                  max-height: 6.25rem;
                }
              }
              .thumb-text {
                margin-left: 1rem;
                text-align: left;

                .thumb-tab-heading {
                  font-size: 1.375rem;
                }
                .thumb-tab-heading_hasItems{
                  font-size: 1.375rem;
                }
                h3{
                  color: $primaryColor;
                }
                p {
                  font-size: 0.875rem;
                  line-height: 1rem;
                  white-space: normal;
                  margin-bottom: 1rem;
                  @media screen and (min-width: $large) and (max-width: $x-large) {
                    display: none;
                  }
                }
              }
            }

            @media screen and (max-width: $medium)  {
              text-align: left;
            }

            &:hover {
              background-color: transparent;
              opacity: $tab_hoverOpacity;
            }

            &.md-active {
              &,
              .thumb-tab-heading {
                color: #000000 !important;
                opacity: $tab_selectedOpacity;
              }
              &:hover {
                opacity: $tab_hoverOpacity;
              }
              h3{

                color: #000 !important;
              }
            }
          }

          .md-tabs-indicator {
            /* background-color: $primaryColor; */
            background-color: #000;
            @media screen and (max-width: $medium)  {
              display: none;
            }
          }
          
        }
        .md-tabs-content{
            min-height: 133px !important;
          }
      }

      .md-button:not([disabled]).md-focused:before,
      .md-button:not([disabled]):active:before,
      .md-button:not([disabled]):hover:before {
        opacity: 0;
      }
    }
    .filter-tabContent{
      display:none;
    }
    .filter-tabContentActive{
      display: flexbox;
      min-height: 100px;
    }
    .filter-tabContentItem{
      float:left;
    }
    .filter-tabContentItem>figure>figcaption{
      text-align:center;
      padding:3px;
      white-space:wrap;
      width:75px;
      font-size:14px;
    }
    .filter-thumb-img{
      width:75px;
      height:75px;
      border-radius: 5px;
      margin: 0 3px;
      border:1px solid #444;
    }
    .filter-thumb-imgActive{
      width:75px;
      height:75px;
      border-radius: 5px;
      margin: 0 3px;
      border:3px solid #d72027;
    }

  }
  .simple-tab-title {
    color: rgba(109,110,112,1);
    font-size: 1.375rem;
  }
 .filterIcon{
    width: 9px;
    height:29px;
 }
 .filterIconGrayedOut{
    width: 9px;
    height:29px;
    color: #ccc;
 }
 .thumb-textGrayedOut{
  color: #ccc;
  margin-left: 1rem;
  text-align: left;
 }

</style>
