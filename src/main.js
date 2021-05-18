import Vue from 'vue'
import App from './App'
import router from './router'
import mindmap from './components/mindmap'
import axios from 'axios'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  render: h => h(mindmap)

})
