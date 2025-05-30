import Vue from 'vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import * as far from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fas)
library.add(far)
Vue.component('font-awesome-icon', FontAwesomeIcon)
