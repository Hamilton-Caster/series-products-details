<template>
  <product-configurator
    v-if="moduleReady"
    :module-id="moduleId"
    :is-modal="isModal"
    :edit-mode="editMode" />
</template>

<script>
import ProductConfigurator from './components/ProductConfigurator/ProductConfigurator.vue'
import {Enumeration} from './utilities/enums'

const DisplayType = new Enumeration({
  Modal: 'ProductConfigurator_ModalView',
  Results: 'ProductConfigurator_ResultsView'
})

export default {
  name: 'app',
  components: {
    ProductConfigurator
  },
  props: {
    editMode: {
      type: String
    }
  },
  data: () => ({
    moduleId: null,
    moduleReady: false,
    moduleUsage: '',
    isModal: true
  }),
  mounted () {
    if (this.$el && this.$el.parentNode) {
      // get the module id from the parent div to pass to apis for security
      this.moduleId = this.$el.parentNode.id.replace('app-', '')
      this.moduleUsage = this.$el.parentNode.dataset.moduleUsage
      this.isModal = this.moduleUsage === DisplayType.Modal
      this.moduleReady = true

      this.$el.parentNode.classList.add('product-configurator-module-wrap')

    }
  }
}
</script>

<style lang="scss">
  @import "assets/variables";

  // Override md-theme bg color
  html {
    &.md-theme-default {
      background-color: transparent !important;
    }
  }

  .md-body-1, .md-body-2, body#Body {
    letter-spacing: 0;
  }

  .product-configurator-module-wrap {
    margin: -1.5rem -15px 0;
    @media screen and (min-width: $medium)  {
      margin: -2.5rem -15px 0;
    }

  }

  // Transition fade
  .fade-enter-active,
  .fade-leave-active {
    transition-duration: 0.3s;
    transition-property: opacity;
    transition-timing-function: ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0
  }


  /** TODO: Remove. for testing purposes only. **/
  .SearchPanels {
    min-height: 20rem;
  }
</style>
