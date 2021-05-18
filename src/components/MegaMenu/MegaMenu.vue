<template>
  <div
    id="megaMenuWrap"
    ref="megaMenuWrap"
    class="mega-menu"
    :class="classList">
    <div class="sub-nav-list-wrap">
      <ul class="sub-nav-list">
        <li>
          <a :href="overviewLink">{{ selectedProductType }} Overview</a>
        </li>
        <li
          class="list-type-item"
          :class="activeClass(ListType.Series)">
          <span @click="onClick($event, ListType.Series)">
            {{ selectedProductType }} by Series
            <span>
              <font-awesome-icon :icon="['fas', 'angle-right']" />
            </span>
          </span>
        </li>
        <li
          class="list-type-item"
          :class="activeClass(ListType.Application)">
          <span @click="onClick($event, ListType.Application)">
            {{ selectedProductType }} by Application
            <span>
              <font-awesome-icon :icon="['fas', 'angle-right']" />
            </span>
          </span>
        </li>
        <li>
          <a :href="selectionTipLink">{{ selectedProductType.slice(0, -1) }} Selection Tips</a>
        </li>
        <li>
          <a :href="hamiltonAcademyLink">Hamilton Academy</a>
        </li>
      </ul>
    </div>
    <series-menu
      ref="seriesMenu"
      :selected-list-type="selectedListType"
      :selected-product-type="selectedProductType"
      :product-list="productList[selectedProductType]" />
  </div>
</template>

<script>
  import { ListType, ProductSeries } from '../enums'
  import { GetMenuAPI } from '../../api'
  import SeriesMenu from './SeriesMenu'

  export default {
    name: "mega-menu",
    components: {SeriesMenu},
    props: {},
    data: () => ({
      hamiltonAcademyLink: '/hamilton-academy',
      ListType,
      menuExpanded: false,
      productList: {
        Wheels: [],
        Casters: []
      },
      ProductSeries,
      selectedProductType: null,
      selectedListType: null,
      othersList: [],
      overviewLinkOption: {
        Casters: null,
        Wheels: null
      },
      outsideClickListener: null
    }),
    computed: {
      classList () {
        let classList = this.menuExpanded ? 'menu-expanded' : 'menu-collapsed'
        return classList
      },
      overviewLink () {
        return this.overviewLinkOption[this.selectedProductType]
      },
      selectionTipLink () {
        return `/${this.selectedProductType.slice(0, -1)}-Selection-Tips1`
      }
    },
    methods: {
      activeClass (type) {
        return type === this.selectedListType ? 'active-item' : ''
      },
      async getProductList (series) {
        return await GetMenuAPI(series)
      },
      initLists () {
        Object.keys(this.productList).forEach(series => {
          this.getProductList(ProductSeries[series])
            .then(res => {
              this.productList[series] = res
            })
        })
      },
      hideOnClickOutside (e) {
        let megaMenu = this.$refs.megaMenuWrap
        this.outsideClickListener = e => {
          if (!megaMenu.contains(e.target)
                && this.menuExpanded
                && e.target.id !== 'castersMenuItem'
                && e.target.id !== 'wheelsMenuItem') {
            this.menuExpanded = false
            removeClickListener()
          }
        }

        const removeClickListener = () => {
          document.removeEventListener('click', this.outsideClickListener)
        }

        document.addEventListener('click', this.outsideClickListener)
      },
      onClick (e, listType) {
        e.preventDefault()
        if (this.selectedListType === listType) {
          this.$refs.seriesMenu.resetListToRoot()
        } else {
          this.selectedListType = listType
        }
      },
      setProductType (type, e) {
        if (type === ProductSeries[this.selectedProductType] && this.menuExpanded) {
          this.menuExpanded = false
          document.removeEventListener('click', this.outsideClickListener)
        } else if (!this.menuExpanded) {
          this.menuExpanded = true
          this.hideOnClickOutside(e)
        }

        this.selectedProductType = ProductSeries.getKey(type)
      },
      setCastersType (e) {
        e.preventDefault()
        this.setProductType(ProductSeries.Casters, e)
      },
      setWheelsType (e) {
        e.preventDefault()
        this.setProductType(ProductSeries.Wheels, e)
      }
    },
    created () {
      this.selectedProductType = ProductSeries.getKey(ProductSeries.Casters)
      this.selectedListType = ListType.Series
      this.initLists()
    },
    mounted () {
      // only interrupt click if not mobile
      let windowSize = window.innerWidth
      if (windowSize > 995) {
        let castersLink = document.getElementById('castersMenuItem')
        castersLink.onclick = this.setCastersType

        let wheelsLink = document.getElementById('wheelsMenuItem')
        wheelsLink.onclick = this.setWheelsType

        this.overviewLinkOption.Casters = castersLink.href
        this.overviewLinkOption.Wheels = wheelsLink.href

      }
    }
  }
</script>

<style lang="scss">
  @import "../../assets/variables";

  .mega-menu {
    background-color: $darkGrey;
    box-shadow: 1px -2px 24px 0px rgba(0, 0, 0, 0.62);
    position: absolute;
    z-index: 100;
    height: 0;
    overflow: hidden;
    transition: height .1s;
    display: flex;
    width: 100%;

    &.menu-collapsed {
    }
    &.menu-expanded {
      height: 27.5rem;
    }

    /* Let's get this party started */
    ::-webkit-scrollbar {
      width: 9px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      -webkit-border-radius: 7px;
      border-radius: 7px;
      background: rgba($lightGreyBg,0.8);
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      -webkit-border-radius: 7px;
      border-radius: 7px;
      background: rgba($mediumLightGrey,0.8);
    }
    ::-webkit-scrollbar-thumb:window-inactive {
      background: rgba($mediumLightGrey,0.6);
    }


  }

  .sub-nav-list-wrap {
    flex: 1 1 25%;
    padding-left: 15px;

    @media (min-width: 2000px) {
      flex: 1 1 calc(10vw + 300px);
      padding-left: 10vw;
    }

    .sub-nav-list {
      width: 100%;
      @media (min-width: 2000px) {
        width: 24.5rem;
      }

      > li {
        margin-bottom: .825rem;
        margin-right: 1.5rem;
        transition: margin-right .1s;
        cursor: pointer;

        > a,
        > span {
          background-color: $mediumGrey;
          color: $white;
          display: block;
          font-weight: 700;
          padding: 1.25rem 1.2rem;
          width: 100%;
          text-decoration: none;
          transition: all .1s;

          font-size: 1.025rem;
          @media (min-width: 2000px) {
            font-size: 1.25rem;
          }

        }

        > span {
          align-content: center;
          display: flex;
          justify-content: space-between;
        }

        &:hover {
          &.list-type-item {
            margin-right: 0;
            > a,
            > span {
              background-color: rgba($mediumGrey, .8);
            }
          }
        }
        &.active-item {
          &.list-type-item {
            margin-right: 0;
            > span {
              color: $primaryColor;
              background-color: $white;
              svg {
                color: $mediumGrey;
              }
            }
          }
        }
      }
    }
  }

  .series-menu-wrap {

    ul {
      align-content: flex-start;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      height: 100%;
      overflow-y: auto;
      width: 100%;
      transition: width .2s;
      padding: 0.9rem 0 0 0.6rem;

      &.vertical {
        width: 22%;
        min-width: 11.7rem;
        padding: 0;

        @media screen and (min-width: 996px) {
          min-width: 15.7rem;
        }
        @media screen and (min-width: 1200px) {
          min-width: 17.7rem;
        }
        @media screen and (min-width: 1400px) {
          min-width: 19.7rem;
        }
        box-shadow: 1px 1px 6px rgba($darkGrey, .4);

        .menu-item {
          margin: 0;
          padding: .5rem;
        }
      }
    }
  }

  .ACS_ProductsBySeries {
    display: none;
  }

  .mode-fade-enter-active, .mode-fade-leave-active {
    transition: opacity .5s ease
  }

  .mode-fade-enter-from, .mode-fade-leave-to {
    opacity: 0
  }
</style>
