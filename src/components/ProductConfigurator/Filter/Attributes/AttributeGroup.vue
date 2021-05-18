<template>
  <div>
    <md-menu
      v-if="!isModal"
      v-show="!isFinderExpanded"
      class="minified"
      md-direction="bottom-start"
      md-align-trigger
      :md-close-on-click="false"
      :md-close-on-select="false"
      :md-active.sync="isExpanded">
      <md-button md-menu-trigger>
        <h2>
          {{ group.title }}<span class="group-toggle-button"><font-awesome-icon
            :icon="['fas', 'angle-down']" /></span>
        </h2>
      </md-button>
      <md-menu-content
        class="attribute-menu">
        <div
          class="attribute-group"
          :class="{isExpanded: 'expanded'}">
          <template
            v-for="(item, index) in attributes">
            <attribute-field
              v-if="item.group === group.groupName"
              :key="index"
              @filter-selected="$emit('filter-selected', $event)"
              :attribute-item="item" />
          </template>
        </div>
      </md-menu-content>
    </md-menu>
    <div
      v-show="isFinderExpanded">
      <h2>
        {{ group.title }}
        <a
          @click.stop="onToggleClick"
          class="group-toggle-button"
          v-show="!isFinderExpanded">
          <font-awesome-icon :icon="['fas', 'caret-down']" />
        </a>
      </h2>
      <div
        class="attribute-group"
        :class="{isExpanded: 'expanded'}">
        <template v-for="(item, index) in attributes">
          <attribute-field
            v-if="item.group === group.groupName"
            @filter-selected="$emit('filter-selected', $event)"
            :key="index"
            :attribute-item="item" />
        </template>
      </div>
    </div>
  </div>
</template>
<script>
  import AttributeField from './AttributeField'

  export default {
    name: 'attribute-group',
    components: { AttributeField },
    props: {
      group: {
        type: Object,
        default: () => {}
      },
      isFinderExpanded: {
        type: Boolean
      },
      isModal: {
        type: Boolean
      },
      attributes: {
        type: Array
      }
    },
    data: () => ({
      attributeValue: null,
      isExpanded: true,
    }),
    watch: {
      isFinderExpanded: {
        handler: function () {
          // Automatically close box if state changes for finder size
          this.isExpanded = false
        }
      }
    },
    methods: {
      onToggleClick () {
        this.isExpanded = !this.isExpanded
      }
    }
  }
</script>

<style lang="scss">
  @import "../../../../assets/variables";

  .product-section {
    --section-width: 100%;
    @media screen and (min-width: $small)  { --section-width: 50%; }
    // @media screen and (min-width: $medium)  { --section-width: 50%; }
    @media screen and (min-width: $large)   { --section-width: 33%; }
    // @media screen and (min-width: $xx-large)   { --section-width: 25%; }

    .product-group {
      margin-bottom: 1rem;
      width: var(--section-width);

      h2 {
        font-size: 1.55rem;
        margin-bottom: .3rem;
      }
    }
  }


  // *** Collapsed ***
  .product-configurator-wrap {
    &.finder-collapsed {
      @media screen and (min-width: $medium) {
        .product-configurator-inner {
          .product-section {
            --section-width: auto;

            .product-group {
              margin-bottom: .9rem;

              &.col-md-4 {
                width: auto;
              }

              .md-button {
                text-transform: none !important;
                margin-top: 1.5rem;
                transition: color .2s;
                margin-left: 0;

                &:hover {
                  background-color: transparent;
                  color: #000;

                  &:before {
                    display: none;
                    content: '';
                  }
                }
              }

              h2 {
                font-size: 1.125rem;
                margin-bottom: 0;
                cursor: pointer;
                line-height: 1;

                .group-toggle-button {
                  transition: transform .1s;
                }
              }

              .dropup {
                h2 {
                  .group-toggle-button {
                    transform: rotate(-180deg) translateY(2px);
                  }
                }

                .dropdown-menu {
                  background: $white;
                  position: fixed;
                  bottom: unset;
                  left: auto;
                  padding: 1.5rem;
                  border: 1px solid $borderColor;

                  &:after,
                  &:before {
                    bottom: 100%;
                    left: 15%;
                    border: solid transparent;
                    content: "";
                    height: 0;
                    width: 0;
                    position: absolute;
                    pointer-events: none;
                  }

                  &:after {
                    border-color: rgba($white, 0);
                    border-bottom-color: $white;
                    border-width: calc(1rem - 1px);
                    margin-left: calc(-1rem + 1px);
                  }

                  &:before {
                    border-color: rgba($borderColor, 0);
                    border-bottom-color: $borderColor;
                    border-width: 1rem;
                    margin-left: -1rem;
                  }
                }
              }
            }
          }
        }
      }
    }

    &.finder-collapsed {
      @media screen and (min-width: $medium) {
        .product-group {
          padding: 0 !important;
        }
      }
    }
  }

  .group-toggle-button {
    background-color: transparent;
    color: $black;
    border: none;
    display: inline-block;
    text-decoration: none;
    padding: 1rem;

    svg {
      color: $black;
    }
  }

  .md-menu-content-small.md-menu-content.md-menu-content-bottom-start {
    z-index: 100;

    &:not(.md-select-menu ) {
      background: $white;
      // position: fixed;
      // bottom: unset;
      // left: auto;
      padding: 1.5rem;
      border: 1px solid $borderColor;
      margin-top: 1rem;
      max-height: unset;

      &:after,
      &:before {
        bottom: 100%;
        left: 15%;
        border: solid transparent;
        content: "";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
      }

      &:after {
        border-color: rgba($white, 0);
        border-bottom-color: $white;
        border-width: calc(1rem - 1px);
        margin-left: calc(-1rem + 1px);
      }
      &:before {
        border-color: rgba($borderColor, 0);
        border-bottom-color: $borderColor;
        border-width: 1rem;
        margin-left: -1rem;
      }
    }

  }

  .md-menu-content {
    &.attribute-menu {
      max-width: 27.5rem;
      width: 27.5rem;
      @media screen and (max-width: $small)  {
        display: none !important;
      }
    }
  }

  /*translate fade (top to down)*/
  .translate-fade-down-enter-active, .translate-fade-down-leave-active {
    transition: all 250ms;
    transition-timing-function: cubic-bezier(.53,2,.36,.85);
  }
  .translate-fade-down-enter, .translate-fade-down-leave-active {
    opacity: 0;
  }
  .translate-fade-down-enter, .translate-fade-down-leave-to {
    position: absolute;
  }

  .translate-fade-down-enter {
    transform: translateY(-10px);
  }
  .translate-fade-down-leave-active {
    transform: translateY(10px);
  }
</style>
