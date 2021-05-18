<template>
  <div class="finder-tabs">
    <md-tabs
      :md-active-tab="selectedTab.toString()"
      @md-changed="onTabChanged">
      <md-tab
        v-for="tab in tabs"
        :key="tab.value"
        :id="tab.value"
        :md-label="tab.name"
        :md-ripple="false" />
    </md-tabs>
    <md-button
      @click="onReset"
      :disabled="disableResetButton"
      class="reset-button">
      Reset Filter
    </md-button>
  </div>
</template>

<script>
  import { ProductTypes } from '../enums'

  export default {
    name: 'finder-tabs',
    props: {
      selectedTab: {
        type: Number
      },
      disableResetButton: {
        type: Boolean,
        default: true
      }
    },
    data: () => ({
      tabs: [
        {
          name: 'Casters',
          value: ProductTypes.Casters.toString()
        },
        {
          name: 'Wheels',
          value: ProductTypes.Wheels.toString()
        }
      ]
    }),
    methods: {
      onTabChanged (id) {
        if (this.selectedTab !== parseInt(id)) {
          this.$emit('change', parseInt(id))
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
  @import '../../assets/variables';

  .finder-tabs {
    // Tabs
    --tab-font-size: 2rem;
    @media screen and (min-width: $medium)  { --tab-font-size: 3rem; }
    $tabFontSize:         var(--tab-font-size);

    $tabFontColor:        $darkGrey;
    $tab_normalOpacity:   .43;
    $tab_hoverOpacity:    .83;
    $tab_selectedOpacity: 1;

    margin-bottom: 2.5rem;
    position: relative;
    @media screen and (min-width: $small) {
      margin-bottom: 1rem;
    }

    .md-tabs {
      z-index: 1;
      &.md-theme-default {
        .md-tabs-navigation {
          background-color: transparent;
          border-bottom: 1px solid $borderColor;
          padding-bottom: .3rem;

          .md-button {
            font-size: $tabFontSize;
            color: $tabFontColor;
            opacity: $tab_normalOpacity;
            text-transform: none;
            margin-right: 0;
            @media screen and (min-width: $small) {
              margin-right: 2rem;
            }
            transition: opacity .2s;
            line-height: 4.1875rem;

            &:hover {
              background-color: transparent;
              opacity: $tab_hoverOpacity;
            }

            &.md-active {
              color: $tabFontColor;
              opacity: $tab_selectedOpacity;

              &:hover {
                opacity: $tab_hoverOpacity;
              }
            }
          }

          .md-tabs-indicator {
            display: none;
          }
        }
      }

      .md-button:not([disabled]).md-focused:before,
      .md-button:not([disabled]):active:before,
      .md-button:not([disabled]):hover:before {
        opacity: 0;
      }
    }

    .md-button {
      &.reset-button {
        text-transform: unset;
        color: $primaryColor;
        text-decoration: underline;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 10;
        font-size: 1.125rem;
        @media screen and (min-width: $small) {
          right: 1rem;
        }

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

</style>
