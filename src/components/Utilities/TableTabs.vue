<template>
  <div class="table-tabs">
    <md-tabs
      :md-active-tab="selectedTab"
      @md-changed="onTabChanged">
      <md-tab
        v-for="tab in tabs"
        :key="tab.value"
        :id="tab.value"
        :md-label="tab.name"
        :md-ripple="false" />
    </md-tabs>
  </div>
</template>

<script>
  import { ProductTypes } from '../enums'

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
    $tab_normalOpacity:   .43;
    $tab_hoverOpacity:    .83;
    $tab_selectedOpacity: 1;

    margin-bottom: 1.5rem;
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
          @media screen and (max-width: $medium)  {
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

            @media screen and (max-width: $medium)  {
              text-align: left;
            }

            &:hover {
              background-color: transparent;
              opacity: $tab_hoverOpacity;
            }

            &.md-active {
              color: $primaryColor;
              opacity: $tab_selectedOpacity;

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

</style>
