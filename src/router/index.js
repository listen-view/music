import Vue from 'vue'
import Router from 'vue-router'
import recommend from 'components/recommend/recommend'
import ranking from 'components/ranking/ranking'
import singer from 'components/singer/singer'
import seacher from 'components/seacher/seacher'
import user from 'components/user/user'
import disc from 'components/disc/disc'
import singerDetail from 'components/singer-detail/singer-detail'
import RankDetail from 'components/rank-detail/rank-detail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: recommend,
      children: [
        {
          path: ':id',
          component: disc
        }
      ]
    },
    {
      path: '/singer',
      component: singer,
      children: [
        {
          path: ':id',
          component: singerDetail
        }
      ]
    },
    {
      path: '/ranking',
      component: ranking,
      children: [
        {
        path: ':id',
        component: RankDetail
        }
      ]
    },
    {
      path: '/seacher',
      component: seacher,
      children: [
        {
        path: ':id',
        component: singerDetail
        }
      ]
    },
    {
      path: '/user',
      component: user
    }
  ],
  linkActiveClass: 'active'
})
