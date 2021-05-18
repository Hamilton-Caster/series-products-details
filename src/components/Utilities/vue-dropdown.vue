<template>
  <div
    class="dropdown vue-dropdown"
    :class="{ 'dropup': top }"
    @click="toggleMenu"
  >
    <slot></slot>
    <transition :name="transition">
      <div
        v-show="value"
        class="dropdown-menu show"
        :style="styles"
        @click.stop
        ref="dropdown">
        <slot name="dropdown"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'vue-dropdown',
  props: {
    value: Boolean,
    styles: {
      type: Object,
      default () {
        return {}
      }
    },
    interactive: { //whether should stay open until clicked outside
      type: Boolean,
      default: false,
    },
    transition: {
      type: String,
      default: '',
    }
  },
  data () {
    return {
      top: false,
      closeOnClickOutside: true
    }
  },
  destroyed () {
    document.body.removeEventListener('click', this.closeMenu)
  },
  methods: {
    closeMenu ($event) {
      if (!$event || !this.$el.contains($event.target)) {
        if (!$event.target.classList.contains('md-list-item-text')) {
          if (this.value && this.closeOnClickOutside) {
            this.$emit('input', false)
          }
        }
      }
    },
    toggleMenu () {
      this.$emit('input', !this.value)
    }
  },
  watch: {
    value (v) {
      if (v) {
        let vm = this
        this.top = false
        this.$nextTick(() => {
            let rect = vm.$refs.dropdown.getBoundingClientRect()
            let window_height = (window.innerHeight || document.documentElement.clientHeight)
            this.top = (rect.bottom > window_height) && (rect.top >= rect.height)
          }
        )
      } else {
        this.top = false
      }
    },
    interactive: {
      handler (value) {
        if(typeof document === "object")
          value ? document.body.addEventListener('click', this.closeMenu) : document.body.removeEventListener('click', this.closeMenu)
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
  @import "../../assets/variables";
  .vue-dropdown {
    .dropdown-menu.show {
      position: fixed;
      bottom: unset;
      left: auto;
      padding: 1.5rem;
      border: 1px solid $borderColor;
    }
  }

</style>
