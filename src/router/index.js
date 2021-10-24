import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () =>
  import(/* webpackChunkName: "Login-Home-Welcome" */ '../components/Login.vue')
const Home = () =>
  import(/* webpackChunkName: "Login-Home-Welcome" */ '../components/Home.vue')
const Welcome = () =>
  import(
    /* webpackChunkName: "Login-Home-Welcome" */ '../components/Welcome.vue'
  )

const Users = () =>
  import(
    /* webpackChunkName: "Users-Rights-Roles" */ '../components/user/Users.vue'
  )
const Rights = () =>
  import(
    /* webpackChunkName: "Users-Rights-Roles" */ '../components/power/Rights.vue'
  )
const Roles = () =>
  import(
    /* webpackChunkName: "Users-Rights-Roles" */ '../components/power/Roles.vue'
  )

const Cate = () =>
  import(/* webpackChunkName: "Cate-Params" */ '../components/goods/Cate.vue')
const Params = () =>
  import(/* webpackChunkName: "Cate-Params" */ '../components/goods/Params.vue')

const List = () =>
  import(/* webpackChunkName: "List-Add" */ '../components/goods/List.vue')
const Add = () =>
  import(/* webpackChunkName: "List-Add" */ '../components/goods/Add.vue')

const Order = () =>
  import(/* webpackChunkName: "Order-Report" */ '../components/order/Order.vue')
const Report = () =>
  import(
    /* webpackChunkName: "Order-Report" */ '../components/report/Report.vue'
  )
Vue.use(VueRouter)
//创建路由
const router = new VueRouter({
  routes: [
    //重定向，只要访问 / 就定位到登录页面
    { path: '/', redirect: '/login' },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      //重定向，只要访问 /home就定位到welcome
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: Welcome
        },
        // 用户页面
        {
          path: '/users',
          component: Users
        },
        //角色页面
        {
          path: '/roles',
          component: Roles
        },
        // 权限页面
        {
          path: '/rights',
          component: Rights
        },
        //商品分类页面
        {
          path: '/categories',
          component: Cate
        },
        //分类参数页面
        {
          path: '/params',
          component: Params
        },
        //商品列表页面
        {
          path: '/goods',
          component: List
        },
        // 添加
        {
          path: '/add',
          component: Add
        },
        // 订单页面
        {
          path: '/orders',
          component: Order
        },
        {
          path: '/reports',
          component: Report
        }
      ]
    }
  ]
})
// 挂载全局路由守卫(router上)，判断是否已经登录
router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next()
  // 获取本地token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    // 没有token,直接跳转到login页面,return
    return next('/login')
  }
  //已经登录，直接放行
  next()
})
export default router
