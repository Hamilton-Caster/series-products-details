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
    --tab-font-size: 1.5rem;
    @media screen and (min-width: $medium)  { --tab-font-size: 2rem; }
    $tabFontSize:         var(--tab-font-size);

    $tabFontColor:        $black;
    $tab_normalOpacity:   .43;
    $tab_hoverOpacity:    .83;
    $tab_selectedOpacity: 1;

    margin-bottom: 1.5rem;
    position: relative;
    @media screen and (min-width: $small) {
      margin-bottom: -.85rem;
    }

    .md-tabs {
      z-index: 1;
      &.md-theme-default {
        .md-tabs-navigation {
          background-color: transparent;
          //border-bottom: 1px solid $borderColor;
          //padding-bottom: .3rem;

          .md-button {
            font-size: $tabFontSize;
            color: $tabFontColor;
            opacity: $tab_normalOpacity;
            text-transform: none;
            margin-right: 0;
            transition: opacity .2s;
            line-height: 2rem;

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