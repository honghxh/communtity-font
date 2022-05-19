import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "../views/Home.vue";
Vue.use(VueRouter)
const routes = [
 
  {
    //主页
    path: '/',
    name: 'home',
    component: Home,
    redirect: '/homePage',
    children:[
      {path: '/fmasgge',component: () => import('../components/message/fmasgge.vue')},
      {path: '/noticeDetail',component: () => import('../components/message/noticeDetail.vue')},
      {path: '/homepage',component: () => import('../components/HomePage.vue')},
      {path: '/personalHome',component: () => import('../components/personal/personalHome.vue')},
      {path: '/discussPostDeatil', component: ()=> import ('../components/discussPost/discussPostDetail.vue')},
      {path: '/messageDetail', component: ()=> import ('../components/message/messageDetail.vue')},
      
    ]
  },
  
]

const router = new VueRouter({
  mode:'history',
  routes
})

export default router
