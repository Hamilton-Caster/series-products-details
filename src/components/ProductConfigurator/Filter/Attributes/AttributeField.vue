<template>
  <div class="field-wrap">
    <md-field
      v-if="isCheckbox">
      <md-checkbox
        md-dense
        v-model="attributeItem.selectedValueId"
        :value="attributeItem.ATTRIBUTE_VALUES[0].LINE_NO"
        @change="onCheckboxChange"
        :disabled="isAttrDisabled(attributeItem.ATTRIBUTE_VALUES[0])"
        :id="attributeId">{{ attributeItem.label }}</md-checkbox>
    </md-field>
    <md-field
      v-else>
      <label for="attribute">{{ attributeItem.label }}</label>
      <md-select
        md-dense
        md-align-trigger
        name="attribute"
        v-model="attributeItem.selectedValueId"
        :multiple="isMultiple"
        @md-selected="onChange"
        :id="attributeId">
        <md-optgroup :label="attributeItem.label">
          <md-option
            v-for="(attribute, index) in attributeItem.ATTRIBUTE_VALUES"
            :key="`${attribute.ATTRIBUTE_VALUE}_${index}`"
            :disabled="isAttrDisabled(attribute)"
            :value="attribute.LINE_NO">
            {{ attribute.ATTRIBUTE_CAPTION }}
          </md-option>
        </md-optgroup>
      </md-select>
    </md-field>
    <md-button
      v-if="!isCheckbox"
      class="clear-button"
      v-show="hasValue"
      @click="clearValue">
      <font-awesome-icon :icon="['fas', 'times']" />
    </md-button>
  </div>
</template>

<script>
  import { AttributeEnabled, AttributeTypes } from '../../../enums'

  export default {
    name: 'attribute-field',
    props: {
      attributeItem: {
        type: Object
      }
    },
    data: () => ({
      attributeValue: null,
      attributeId: null,
      selectedValue: null
    }),
    computed: {
      hasValue () {
        return !(this.attributeItem.selectedValueId === null || (this.attributeItem.selectedValueId !== undefined && this.attributeItem.selectedValueId.length === 0))
      },
      isMultiple () {
        return this.attributeItem.fieldType === AttributeTypes.Checkbox
      },
      isCheckbox () {
        // Check to see if type is checkbox and there is only 1 option, then display as a single checkbox, not as a dropdown
        return this.attributeItem.fieldType === AttributeTypes.Checkbox && this.attributeItem && this.attributeItem.ATTRIBUTE_VALUES.length === 1
      }
    },
    methods: {
      isAttrDisabled (attribute) {
        return attribute.ATTRIBUTE_VALUE_ENABLED === AttributeEnabled.Disabled
      },
      clearValue () {
        this.attributeItem.selectedValueId = null
        this.$emit('filter-selected', true)
      },
      onChange (value) {
        this.$emit('filter-selected', value)
      },
      onCheckboxChange (value) {
        this.$emit('filter-selected', value || 'is-checkbox')
      }
    },
    created () {
      this.attributeId = `attribute_${this.attributeItem.ATTRIBUTE_ID}_${this.attributeItem.ID}`
    },
    mounted () {

    }
  }
</script>

<style lang="scss">
  @import '../../../../assets/variables';

  .md-menu-content.md-select-menu {
    // margin-top: 1.3rem;
    margin-left: 1rem;
    max-width: 315px;

    .md-selected {
      background-color: $primaryColorActive;
      .md-list-item-text {
        color: $white;
      }
    }
    .md-list.md-theme-default [disabled] {
      background-color: $lightGreyBg;
    }
    .md-checkbox.md-theme-default.md-checked.md-primary .md-checkbox-container {
      background-color: $primaryColorActive;
      border-color: $white;
    }
  }


  .field-wrap {
    display: flex;
    align-items: center;
    margin-bottom: .3rem;

    .md-field {
      width: calc(100% - 3rem);
      @media screen and (min-width: $medium)  {
        width: calc(100% - 4rem);
      }
      border: 1px solid $borderColor;
      background-color: $white;
      padding: 0;
      margin: 0;

      label {
        left: 1rem;
        top: 0.8125rem;
      }
      &.md-focused label,
      &.md-has-value label {
        top: .015rem;
      }

      input,
      textarea {
        margin-bottom: .3rem;
        padding: 1.75rem 1rem 0.8rem
      }

      &.md-theme-default:before,
      &.md-theme-default:after{
        display: none;
      }

      > .md-checkbox {
        padding: 12px 16px 0px 0;
        margin: unset;
        .md-checkbox-container {
          left: 1rem;
          &:before {
            height: 2rem;
          }
          .md-ripple {
            height: 40.8px !important;
          }
        }
        .md-checkbox-label {
          top: unset;
        }
      }
    }
    .clear-button {
      &.md-button {
        min-width: 32px;

        &.md-theme-default {
          &:hover {
            background-color: $white;
          }
        }
      }
    }

    // Transitions

    .list-enter-active,
    .list-leave-active,
    .list-move {
      transition: 500ms cubic-bezier(0.59, 0.12, 0.34, 0.95);
      transition-property: opacity, transform;
    }

    .list-enter {
      opacity: 0;
      transform: translateX(50px) scaleY(0.5);
    }

    .list-enter-to {
      opacity: 1;
      transform: translateX(0) scaleY(1);
    }

    .list-leave-active {
      position: absolute;
    }

    .list-leave-to {
      opacity: 0;
      transform: scaleY(0);
      transform-origin: center top;
    }

  }
</style>
