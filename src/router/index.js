import Vue from 'vue'
import Router from 'vue-router'

//登录
import Login from '@/page/Login/Login' //登录

import Home from '@/layout/Home'

//首页
import Index from '@/page/Index/Index' //首页

//商户管理
import MerchantsList from '@/page/Merchants/MerchantsList' //商户列表
import AddMerchantsRouter from '@/page/Merchants/AddMerchantsRouter' //新增商户Router
import NewAddMerchants from '@/page/Merchants/NewAddMerchants' //新增商户

//账户信息
import AccountMan from '@/page/Account/AccountMan' //子账户管理
import PhoneList from '@/page/Account/PhoneList' //手机卡管理
import VoiceTemplate from '@/page/Account/VoiceTemplate' //语音模板管理
import MerConfig from '@/page/Account/MerConfig' //权限管理
import MerConfigMan from '@/page/Account/MerConfigMan' //权限配置

//数据分析
import DataAnalysis from '@/page/Data/DataAnalysis'

//其他
import Advice from '@/page/Other/Advice' //意见建议
import Repair from '@/page/Other/Repair' //故障报修

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login, 
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children:[
        {
          path: '/index',
          name: 'Index',
          component: Index
        },
        {//商户列表
          path: '/merchantsList',
          name: 'MerchantsList',
          component: MerchantsList
        },
        {//新增商户
          path: '/AddMerchantsRouter',
          name: 'AddMerchantsRouter',
          component: AddMerchantsRouter,
          redirect: '/newAddMerchants',
          children:[
            {
              path: '/newAddMerchants',
              name: 'NewAddMerchants',
              component: NewAddMerchants
            }
          ]
        },
        
        {//子账户管理
          path: '/accountMan',
          name: 'AccountMan',
          component: AccountMan
        },
        {//话费清单
          path: '/phoneList',
          name: 'PhoneList',
          component: PhoneList
        },
        {//语音模板管理
          path: '/voiceTemplate',
          name: 'VoiceTemplate',
          component: VoiceTemplate
        },
        
        {//权限管理
          path: '/merConfig',
          name: 'MerConfig',
          component: MerConfig
        },
        {//权限配置
          path: '/merConfigMan',
          name: 'MerConfigMan',
          component: MerConfigMan
        },
        {//数据分析
          path: '/dataAnalysis',
          name: 'DataAnalysis',
          component: DataAnalysis
        },
        {//意见建议
          path: '/advice',
          name: 'Advice',
          component: Advice
        },
        {//故障报修
          path: '/repair',
          name: 'Repair',
          component: Repair
        }
      ]
    }
  ]
})
