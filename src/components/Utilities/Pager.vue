<template>
  <uib-pagination
    v-show="totalItems > itemsPerPage"
    boundary-links
    rotate
    v-model="pager"
    :total-items="totalItems"
    :max-size="maxSize"
    first-text="«"
    previous-text="‹"
    :items-per-page="itemsPerPage"
    next-text="›"
    last-text="»"
    :disabled="disabled"
    class="pager-wrapper"
    @change="onPageChange" />
</template>

<script>

  export default {
    name: "pager",
    props: {
      disabled: {
        type: Boolean
      },
      /**
       * @param {Number} selectedPage - Selected page. 1 based.
       */
      pagination: {
        type: Object
      },
      totalItems: {
        type: Number
      },
      itemsPerPage: {
        type: Number,
        default: 12
      }
    },
    data () {
      return {
        maxSize: 5,
        pager: this.pagination
      }
    },
    watch: {
      pagination: {
        handler: function (pagination) {
          if (this.pager !== pagination) {
            this.pager = pagination
          }
        },
        deep: true
      }
    },
    methods: {
      onPageChange (page) {
        this.$emit('page-changed', this.pager)
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

  .md-theme-default {
    .pager-wrapper {
      margin: calc(.85rem / 2) 15px;

      @media screen and (max-width: $medium)  {
        margin: 2rem 1rem;
        width: auto;
        justify-content: space-between;
      }

      &.pagination {
        display: flex;
      }
      a:not(.md-button) {
        background-color: transparent;
        border: none;
        color: $primaryColor !important;
        width: 2.05rem;
        padding: .4rem 0;
        text-align: center;

        &:hover {
          color: $primaryColorHover;
        }
      }
      .active {
        a:not(.md-button) {
          background-color: $mediumGrey;
          border: 1px solid $borderColor;
          color: $white !important;
        }
      }
      .pagination-first,
      .pagination-prev,
      .pagination-next,
      .pagination-last {
        a:not(.md-button) {
          padding-top: 0;
          padding-bottom: 0;
          line-height: 1.85rem;
          height: 2.15rem;
          padding: 0 0.4rem;
          font-size: 1.5rem;
          text-align: center;
        }

        &.disabled {
          a:not(.md-button) {
            opacity: .3;
          }
        }
      }
    }
  }
</style>
