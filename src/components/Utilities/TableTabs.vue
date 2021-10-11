<template>
  <div class="table-tabs">
    <md-tabs
      :md-active-tab="selectedTab"
      @md-changed="onTabChanged">
      <template
        slot="md-tab"
        slot-scope="{ tab }">
        <div
          class="thumb-tab"
          v-if="tab.data.tabData != null">
          <div
            class="img-wrap"
            v-if="tab.data.tabData.ImageURL">
            <img
              class="thumb-img"
              :src="tab.data.tabData.ImageURL"
              :alt="getTabTitle(tab)">
          </div>
          <div class="thumb-text">
            <h3 class="thumb-tab-heading" v-html="getTabTitle(tab)"></h3>
            <p v-if="tab.data.tabData.Description" v-html="tab.data.tabData.Description"></p>
          </div>
        </div>
        <div v-else class="simple-tab-title">
          {{ getTabTitle(tab) }}
        </div>
      </template>
      <md-tab
        v-for="tab in tabs"
        :key="tab.value"
        :id="tab.value"
        :md-label="tab.name"
        :md-template-data="{ tabData: tab.tabData}"
        :md-ripple="false" />
    </md-tabs>
  </div>
</template>

<script>
  export default {
    name: 'table-tabs',
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
      }
    },
    data: () => ({ }),
    methods: {
      onTabChanged (id) {
        if (this.selectedTab !== id) {
          this.$emit('change', id)
        }
      },
      onReset () {
        this.$emit('reset-filter')
      },
      getTabTitle (tab) {
        return tab.data.tabData && tab.data.tabData.Title ? tab.data.tabData.Title : tab.label
      }
    },
    created () {

    },
    mounted () {

    }
  }
</script>

<style lang="scss">
@import "../../assets/variables";

  .table-tabs {
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
    float: left;
    @media screen and (min-width: $small) {
      margin-top: 0.75rem;
      margin-bottom: -0.1rem;
    }

    .md-tabs {
      z-index: 1;
      &.md-theme-default {
        .md-tabs-navigation {
          background-color: transparent;
          //border-bottom: 1px solid $borderColor;
          //padding-bottom: .3rem;
          @media screen and (max-width: $large)  {
            flex-direction: column;
            .md-ripple {
              justify-content: left;
            }
          }

          .md-button {
            font-size: $tabFontSize;
            color: $tabFontColor;
            opacity: $tab_normalOpacity;
            text-transform: none;
            margin-right: 0;
            transition: opacity .2s;
            line-height: 2rem;
            max-width: 24rem;
            height: auto;
            min-height: 4rem;

            .md-ripple {
              align-items: flex-start;
              @media screen and (min-width: $large) and (max-width: $x-large) {
                padding: 0 .5rem;
              }
            }

            .thumb-tab {
              display: flex;
              flex-direction: row;
              align-items: start;

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
                color: $primaryColor;
                opacity: $tab_selectedOpacity;
              }

              &:hover {
                opacity: $tab_hoverOpacity;
              }
            }
          }

          .md-tabs-indicator {
            background-color: $primaryColor;
            @media screen and (max-width: $medium)  {
              display: none;
            }
          }
        }
      }

      .md-button:not([disabled]).md-focused:before,
      .md-button:not([disabled]):active:before,
      .md-button:not([disabled]):hover:before {
        opacity: 0;
      }
    }

  }
  .simple-tab-title {
    color: rgba(109,110,112,1);
    font-size: 1.375rem;
  }

</style>
