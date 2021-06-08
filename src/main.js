import Vue from 'vue'
import App from './App.vue'
import VueAxios from 'vue-axios'
import axios from 'axios'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import pagination from "vuejs-uib-pagination"
import { Scroll } from '@/Directives/scroll'

// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
// import icons from custom library - see library for notes
import FontAwesomeLibrary from '@/assets/fontawesome.library'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(FontAwesomeLibrary)

// Config
Vue.config.productionTip = false

// Dependencies
Vue.use(VueAxios, axios)
Vue.use(VueMaterial)
Vue.material.ripple = false
Vue.use(pagination)

// Directives
Vue.directive('scroll', Scroll)

Vue.component(FontAwesomeIcon.name, FontAwesomeIcon)

// Global components
Vue.component('app', require('./App').default)

// Hide buggy error for vue-material library
Vue.config.errorHandler = (err, vm, info) => {
    // Show any error but this one
  if (err.message !== "Cannot read property 'badInput' of undefined") {
    console.error(err)
  }
}

new Vue({
  render: h => h(App)
}).$mount('#catalogApp')
