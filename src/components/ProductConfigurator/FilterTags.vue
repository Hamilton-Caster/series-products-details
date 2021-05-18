<template>
  <transition name="fade">
    <div class="filter-tags">
      <div>
        <md-chip
          v-for="tag in tagList"
          :id="`tag_${tag.ID}`"
          :key="tag.ID"
          @md-delete="onDelete(tag)"
          class="md-default"
          md-deletable>
          {{ tag.label }}: {{ getTagValue(tag) }}
        </md-chip>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "filter-tags",
    props: {
      tagList: {
        type: Array,
        default: () => []
      }
    },
    data: () => ({
    }),
    methods: {
      onDelete ($event) {
        // let tagList = this.tagList.filter(tagItem => tagItem !== $event)
        // this.$emit('update:tagList', tagList)
        this.$emit('delete-tag', $event.ID)
      },
      getTagValue (tag) {
        let value = ''
        if (Array.isArray(tag.ATTRIBUTE_VALUES)) {
          tag.ATTRIBUTE_VALUES.forEach(attrValue => {
            value += value === '' ? `${attrValue.ATTRIBUTE_CAPTION}` : `, ${attrValue.ATTRIBUTE_CAPTION}`
          })
        } else {
          value = tag.ATTRIBUTE_VALUES.ATTRIBUTE_CAPTION
        }
        return value
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

  .md-chip {
    &.md-theme-default{
      &.md-deletable {
        background: $mediumGrey 0% 0% no-repeat padding-box;
        border: 1px solid $darkGrey;
        border-radius: 11px;
        font: normal normal normal 0.75rem/1.3125rem Roboto;
        opacity: 1;
        text-align: left;
        letter-spacing: -0.08px;
        color: $white;
        height: 1.5rem;
        margin: .25rem .75rem .25rem 0;
      }
    }
  }
</style>
