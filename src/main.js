import Vue from 'vue'
import App from './App'
import router from './router'
import mindmap from './components/mindmap'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css' //样式必须引入

Vue.use(ElementUI);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  render: h => h(mindmap)

})
