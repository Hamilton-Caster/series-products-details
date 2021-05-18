import Vue from 'vue'
import App from './App.vue'
import App_MegaMenu from './App_MegaMenu'
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
// Vue.directive('click-outside', {
//   bind: function (el, binding, vnode) {
//     el.clickOutsideEvent = function (event) {
//       // here I check that click was outside the el and his children
//       if (!(el == event.target || el.contains(event.target))) {
//         // and if it did, call method provided in attribute value
//         vnode.context[binding.expression](event);
//       }
//     };
//     document.getElementById('productFinderLink').addEventListener('click', el.clickOutsideEvent)
//   },
//   unbind: function (el) {
//     document.getElementById('productFinderLink').removeEventListener('click', el.clickOutsideEvent)
//   },
// });

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
}).$mount('#app')

// Global components
Vue.component('app_megaMenu', require('./App_MegaMenu').default)

new Vue({
  render: h => h(App_MegaMenu)
}).$mount('#app_megaMenu')
