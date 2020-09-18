import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/view/Index'

//新的页面
import dashboard from '@/view/dashboard/index'
import user from '@/view/user/index'
import role from '@/view/role/index'
import project from '@/view/project/index'
import coupon from '@/view/coupon/index'
import customerCoupon from '@/view/customerCoupon/index'
import centrum from '@/view/centrum/centrum'
import potential from '@/view/centrum/potential'
import trajectory from '@/view/centrum/trajectory'
import login from '@/view/login/index'
Vue.use(Router)
//以下代码解决路由地址重复点击的报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
 const routers= new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: dashboard,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/user',
      name: 'user',
      component: user,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/role',
      name: 'role',
      component: role,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/project',
      name: 'project',
      component: project,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/coupon',
      name: 'coupon',
      component: coupon,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/customerCoupon',
      name: 'customerCoupon',
      component: customerCoupon,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/centrum/centrum',
      name: 'centrum',
      component: centrum,
      meta: {
        keepAlive: true
      },
    },
    {
      path: '/centrum/potential',
      name: 'potential',
      component: potential,
      meta: {
        keepAlive: true
      },
    },
    {
      path: '/centrum/trajectory',
      name: 'trajectory',
      component: trajectory,
      meta: {
        keepAlive: true
      },
    }
  ]
})

routers.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    window.sessionStorage.clear()
    return next()
  }
  const tokenStr = window.sessionStorage.getItem('userInfo')
  if (!tokenStr) return next('/login')
  next()
})

export default routers