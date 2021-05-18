<template>
  <div class="col-md-3">
    <div class="panel panel-default">
      <div class="panel-heading">
        <a
          :id="`dnn_ctr20374_ProductConfigurator_lvResults_ctrl0_HyperLink1_${index}`"
          :href="PART_URL">
          {{ PART_ID }}
        </a>
        <span class="glyphicon glyphicon-triangle-right" aria-hidden="true" style="display:none;"></span>
      </div>
      <div class="panel-body config-image">
        <a :href="PART_URL">
          <img
            :src="IMAGE_PATH"
            class="application-image"
            :alt="PART_ID">
        </a>
      </div>
      <product-rating
        :ratings="ratings" />
      <template
        v-for="(attribute, attributeIndex) in PART_ATTRIBUTES">
        <detail-text
          v-if="attribute.ATTRIBUTE_TYPE !== ProductAttributeTypes.Rating"
          :key="attributeIndex"
          v-bind="attribute" />
      </template>

      <!--
      <div class="panel-footer">
        Compare Products
        <span class="pull-right">
          <span :title="PART_ID">
            <input
              :id="`dnn_ctr20374_ProductConfigurator_lvResults_ctrl0_cbAddCompare_${index}`"
              type="checkbox"
              :name="`dnn$ctr20374$ProductConfigurator$lvResults$ctrl0$ctl0${index}$cbAddCompare`"
              :onclick="`javascript:setTimeout('__doPostBack(\'dnn$ctr20374$ProductConfigurator$lvResults$ctrl0$ctl0${index}$cbAddCompare\',\'\')', 0)`"></span>
        </span>
      </div>
      -->
    </div>
  </div>
</template>

<script>
  import DetailText from './DetailText'
  import ProductRating from './ProductRating'
  import { ProductAttributeTypes } from '../../enums'

  export default {
    name: "product-item",
    components: {ProductRating, DetailText},
    props: {
      PART_ID: {
        type: String
      },
      PART_URL: {
        type: String
      },
      IMAGE_PATH: {
        type: String
      },
      index: {
        type: Number,
        default: 0
      },
      PART_ATTRIBUTES: {
        type: Array,
        default: () => []
      }
    },
    data: () => ({
      ratings: [],
      ProductAttributeTypes
    }),
    created () {
      this.ratings = this.PART_ATTRIBUTES.filter(attr => attr.ATTRIBUTE_TYPE === ProductAttributeTypes.Rating)
      this.ratings.forEach(rating => parseInt(rating.VALUE))
    }
  }
</script>

<style scoped lang="scss">
  .config-image {
    min-width: 200px;
    min-height: 200px;
    text-align: center;

    img {
      width: auto;
      height: 100%;
      max-height: 200px;
    }
  }

</style>
