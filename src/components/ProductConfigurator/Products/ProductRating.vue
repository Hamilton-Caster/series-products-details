<template>
  <div
    class="panel-body ratings">
    <template
      v-for="(rating, index) in ratings">
      <div
        :key="index"
        class="col-md-6">
        {{ rating.CAPTION }}
        <rating-blocks :rating="parseFloat(rating.VALUE)" />
      </div>
      <template v-if="(index & 1) && index !== ratings.length - 1">
        <hr class="ratings-border" :key="`line_${index}`">
      </template>
    </template>
  </div>
</template>

<script>
  import RatingBlocks from './RatingBlocks'
  export default {
    name: "product-rating",
    components: {RatingBlocks},
    props: {
      ratings: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {}
    },
    methods: {

    },
    created () {

    },
    mounted () {

    }
  }
</script>

<style lang="scss">
  $grey: rgba(168,173,177,1);
  $padding: 15px;

  .ratings-border {
    border-color: $grey;
    display: block;
    margin-left: -$padding;
    margin-right: -$padding;
    padding-bottom: $padding;
    position: relative;
    top: $padding;
  }
  .panel-body.ratings ul {margin:0px !important;}
  .panel-body.ratings li{
    display: inline-block;
    width: 13px;
    height: 20px;
    background: rgba(168,173,177,1);
    margin: 5px 3px 0 0;
    padding: 0;
    background-image: none;
    list-style-type:square;
  }
  @media (min-width: 1200px) {
    .panel-body ul li {
      width: 13px !important;
      height: 20px !important;
      margin: 5px 3px 0 0 !important;
    }
  }
</style>
