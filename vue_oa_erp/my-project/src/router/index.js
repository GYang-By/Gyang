import Vue from 'vue'
import Router from 'vue-router'
import unverfied from '@/components/unverfied'
import StarRatings from '@/components/star-ratings'
import verifiedUser from '@/components/verified-user'
import VueResource from 'vue-resource'

import complaintsSuggestions from '@/components/complaintsSuggestions'
import failureDeclare from '@/components/failureDeclare';
import hardwareRepair from '@/components/hardwareRepair';
import invitingColleague from '@/components/invitingColleague';
import myLnvitation from '@/components/myLnvitation';
import orderQuery from '@/components/orderQuery';
import processingProgress from '@/components/processingProgress';
import repairEnquiry from '@/components/repairEnquiry';

Vue.use(Router)
Vue.use(VueResource)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'unverfied',
      component: unverfied,
      meta: { auth: true }
    },
    {
      path: '/ratings',
      name: 'StarRatings',
      component: StarRatings,
    },
    {
      path: '/verified-user',
      name: 'verified-user',
      component: verifiedUser,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/complaintsSuggestions',
      name: 'complaintsSuggestions',
      component: complaintsSuggestions,
    },
    {
      path: '/failureDeclare',
      name: 'failureDeclare',
      component: failureDeclare,
    },
    {
      path: '/hardwareRepair',
      name: 'hardwareRepair',
      component: hardwareRepair,
    },
    {
      path: '/invitingColleague',
      name: 'invitingColleague',
      component: invitingColleague,
    },
    {
      path: '/myLnvitation',
      name: 'myLnvitation',
      component: myLnvitation,
    },
    {
      path: '/orderQuery',
      name: 'orderQuery',
      component: orderQuery,
    },
    {
      path: '/processingProgress',
      name: 'processingProgress',
      component: processingProgress,
    },
    {
      path: '/repairEnquiry',
      name: 'repairEnquiry',
      component: repairEnquiry,
    }
  ]
})
