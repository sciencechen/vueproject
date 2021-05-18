import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import helloworld2 from '@/components/helloworld2'

Vue.use(Router)



export default new Router({
  routes: [
    {
      path: '/a',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/b',
      name: 'HelloWorld',
      component: helloworld2
    },
    {
      path: '/c',
      name: 'mindmap',
      component: (resolve) => require(['@/components/mindmap'], resolve),
    },
    {
      path: '',
      redirect: '/c',
    }
  ]
})
