<template>
  <li
    class="menu-item"
    :class="classList">
    <div
      class="clearfix"
      @click="onItemClicked(menuItem)">
      <div class="image-wrap">
        <img
          :src="menuItem.SeriesImage"
          class="item-image" />
      </div>
      <div class="text-wrap">
        <h3
          v-html="menuItem.Title"></h3>
        <span
          v-if="menuItem.Description"
          class="item-description"
          v-html="menuItem.Description"></span>
        <a
          v-if="hasChildren"
          class="item-link"
          :href="menuItem.Web_Url">Learn More</a>

        <font-awesome-icon
          v-if="hasChildren"
          class="item-arrow"
          :icon="['fas', 'angle-right']" />
      </div>
    </div>
  </li>
</template>

<script>
export default {
  name: 'menu-item',
  props: {
    menuItem: {
      type: Object
    },
    productList: {
      type: Array
    },
    disableArrow: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({

  }),
  computed: {
    hasChildren () {
      let hasChildren = this.productList.some(child => child.ParentID === this.menuItem.LandingPageID)

      return this.menuItem.LandingPageID !== -1 && hasChildren
    },
    classList () {
      let classList = this.isActive ? 'active' : ''
      if (!this.hasChildren) {
        classList += 'hide-border '
      }
      return classList
    }
  },
  methods: {
    onItemClicked (menuItem) {
      if (this.hasChildren) {
        this.$emit('menu-click', menuItem)
      } else {
        window.location.href = menuItem.Web_Url
        return false
      }
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

  .menu-item {
    margin: 0 0 1.4rem 0;
    cursor: pointer;
    border-width: 1px;
    border-style: solid;
    border-color: rgba($mediumGrey, 0);

    > div {
      display: flex;
      position: relative;
      width: 17.5rem;
      min-height: 7rem;
      transition: all .2s;

      .image-wrap {
        display: none;
        @media screen and (min-width: 996px) {
          display: block;
          width: 4.5rem;
          height: 4.5rem;
          margin-right: 0.625rem;

        }

        .item-image {
          max-width: 4.5rem;
          max-height: 4.5rem;
          width: 100%;
          float: left;
        }
      }

      .text-wrap {
        flex: 1;
        h3 {
          font-size: 1rem;
          line-height: 0.875rem;
          margin: 0;
          padding: 0 !important;
        }

        .item-description {
          font-size: .6825rem;
          padding-right: 1rem;
          display: block;
          margin-top: .4rem;
          line-height: 1rem;
          letter-spacing: .4px;
          white-space: break-spaces;
          width: 11rem;

          > br {
            display:none;
            content: ' ';
          }
        }

        .item-link {
          display: table;
          font-size: 0.85rem;
          margin-top: 5px;
          letter-spacing: 0.5px;
          text-indent: 3px;
        }
      }

      .item-arrow {
        position: absolute;
        right: 1.1em;
        font-size: 2rem;
        height: auto;
        top: 1.4rem;
        color: $primaryColor;
        opacity: 0;
        transition: all .2s;
      }
    }

    &:hover:not(.hide-border) {
      border-color: rgba($lightGrey, 0);
      > div {
        h3,
        .item-description {
          color: $darkGreyBg;
        }
        .item-arrow {
          opacity: 1;
          right: 1.7rem;
        }
      }
    }

    .hide-border {
      > div {
        h3,
        .item-description {
          color: rgba($darkGreyBg, .7);
          transition: color .2s;
        }
      }
    }

    &:hover.hide-border {
      > div {
        h3,
        .item-description {
          color: $darkGreyBg;
        }
      }
    }
  }
  .clearfix::after {
    content: "";
    clear: both;
    display: table;
  }

  .vertical {
    .series-menu-wrap ul.vertical .menu-item {
       padding: 0;
    }
    .menu-item {
      width: 100%;

      & > div {
        padding: 0;
        min-height: 5rem;
        width: 100%;

        .item-arrow {
          opacity: 1;
          right: 1.3rem;
        }
        &:hover:not(.hide-border) {
          .item-arrow {
            right: 0.7rem;
          }
        }
      }

      &.active {
        background-color: $lightGreyBg;

        > div {
          .item-arrow {
            color: $mediumGrey;
            right: .4rem;
          }
        }
        &:hover:not(.hide-border) {
          .item-arrow {
            right: 0.1rem;
          }
        }
      }
    }
  }

</style>
