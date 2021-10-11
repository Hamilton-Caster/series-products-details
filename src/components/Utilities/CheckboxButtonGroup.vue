<template>
  <div class="button-group">
    <div class="radio-buttons">
      <template
        v-for="(option, index) in options">
        <input
          :key="`input_${option.value}`"
          type="radio"
          :id="`${index}_${uid}`"
          :class="getClass(index)"
          :name="`name_${uid}`"
          :value="option.value"
          :checked="selectedValue === option.value"
          @change="onChange(option)">
        <label
          :key="`label_${option.value}`"
          :for="`${index}_${uid}`">{{ option.text }}</label>
      </template>
      <div class="slider"></div>
    </div>
  </div>
</template>

<script>

const uid = function(){
  let guid = Date.now().toString(36) + Math.random().toString(36).substr(2)
  return guid;
}

export default {
  name: 'checkbox-button-group',
  props: {
    options: {
      type: Array,
      default: () => []
    },
    selectedValue: {
      type: [String, Number, Boolean]
    }
  },
  data () {
    return {
      uid: uid()
    }
  },
  methods: {
    getClass (index) {
      return `option_${index}`
    },
    onChange (option) {
      this.$emit('change', option.value)
    }
  },
  created () {

  },
  mounted () {

  }
}
</script>

<style scoped lang="scss">
@import "../../assets/variables";

.button-group {
  display: flex;
}
.radio-buttons {
  position: relative;
  background: $primaryColor;
  padding: 0;
  height: 3.43em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  input[type=radio] {
    display: none;
  }
  label {
    cursor: pointer;
    z-index: 1;
    padding: 1em 0;
    width: 8rem;
    color: #fff;
    text-align: center;
  }
  .slider {
    position: absolute;
    width: 8rem;
    height: 3.43em;
    transition: all .4s ease;
  }

  .option_0 {
    &:checked ~ .slider {
      background: $primaryColorActive;
      left: 0;
    }
  }
  .option_1 {
    &:checked ~ .slider {
      background: $primaryColorActive;
      left: 8rem;
    }
  }
  .option_2 {
    &:checked ~ .slider {
      background: $primaryColorActive;
      left: 16rem;
    }
  }
  .option_3 {
    &:checked ~ .slider {
      background: $primaryColorActive;
      left: 24rem;
    }
  }
}
</style>
