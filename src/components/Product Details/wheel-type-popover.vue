<template>
  <div>
    <a
      class="popover-link"
      :href="type.GridWheelURL"
      v-html="type.WheelType"></a>
    <md-tooltip
      class="wheel-type-popopver"
      md-direction="top">
      <div class="inner-popover">
        <img
          class="popover-thumb"
          :src="`/${type.GridWheelPopupImage}`"
          :alt="type.WheelType">
        <span
          class="popover-description"
          v-html="type.GridWheelDescription"></span>
      </div>
    </md-tooltip>
  </div>
</template>

<script>
export default {
  name: 'wheel-type-popover',
  props: {
    type: Object
  },
  data () {
    return {}
  },
  methods: {},
  created () {

  },
  mounted () {

  }
}
</script>

<style scoped lang="scss">
  @import "../../assets/variables";

  .series-table td a,
  .series-table td a[href] {
    &.popover-link {
      color: rgba(109, 110, 112, 1);
      border-bottom: 1px dotted;
      &:hover {
        color: $primaryColor;
        text-decoration: none;
        border-bottom-color: $primaryColor;
      }
    }
  }

  .wheel-type-popopver {
    &.md-tooltip.md-theme-default {
      color: $black;
      height: auto;
      background-color: transparent;

      &:after {
        content: ' ';
        margin: 0 auto;
        display: block;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: .8rem .8rem 0 .8rem;
        border-color: rgba($white, 1) transparent transparent transparent;
      }

      .inner-popover {
        background-color: rgba($white, 1);
        display: flex;
        width: 20rem;
        padding: .5rem 1rem;
        border-bottom: 1px solid rgba($lightGrey, .4);

        .popover-thumb {
          margin-right: 1rem;
          height: 100%;
        }
        .popover-description {
          font-size: .8rem;
          white-space: normal;
          line-height: 1.2rem;
        }
      }
    }
  }
</style>
