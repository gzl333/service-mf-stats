// stats api

/* eslint-disable camelcase */

import { axiosStats } from 'boot/axios'

export const apiBaseHarbor = axiosStats.defaults.baseURL
export default {
  // stats apis
  api: {
    getRegistry () {
      return axiosStats.get('/registry')
    },
    getService (payload?: {
      query?: {
        page: number;
        page_size: number;
        center_id: string;
        available_only: boolean;
      }
    }) {
      const config = {
        params: payload?.query
      }
      return axiosStats.get('/service', config)
    },
    getUserPermissionPolicy (payload?: {
      query?: {
        page: number;
        page_size: number;
      }
    }) {
      const config = {
        params: payload?.query
      }
      return axiosStats.get('/user/permission-policy', config)
    },
    getMeteringServer (payload: {
      query?: {
        page: number;
        page_size: number;
        service_id: string;
        server_id: string;
        date_start: string;
        date_end: string;
        vo_id: string;
        user_id: string;
        'as-admin': boolean
      }
    }) {
      const config = {
        params: payload.query
      }
      return axiosStats.get('/metering/server', config)
    },
    getAggregationServer (payload: {
      query?: {
        page: number;
        page_size: number;
        date_start: string;
        date_end: string;
        vo_id: string;
        user_id: string;
        service_id: string;
        'as-admin': boolean
      }
    }) {
      const config = {
        params: payload.query
      }
      return axiosStats.get('/metering/server/aggregation/server', config)
    },
    getAggregationUser (payload: {
      query?: {
        page: number;
        page_size: number;
        date_start: string;
        date_end: string;
        service_id: string;
        'as-admin': boolean
      }
    }) {
      const config = {
        params: payload.query
      }
      return axiosStats.get('/metering/server/aggregation/user', config)
    },
    getAggregationVo (payload: {
      query?: {
        page: number;
        page_size: number;
        date_start: string;
        date_end: string;
        service_id: string;
        'as-admin': boolean
      }
    }) {
      const config = {
        params: payload.query
      }
      return axiosStats.get('/metering/server/aggregation/vo', config)
    },
    getAggregationService (payload: {
      query?: {
        page: number;
        page_size: number;
        date_start: string;
        date_end: string;
        'as-admin': boolean
      }
    }) {
      const config = {
        params: payload.query
      }
      return axiosStats.get('/metering/server/aggregation/service', config)
    }
  },
  vo: {
    getVo (payload?: {
      query?: {
        page: number;
        page_size: number;
        owner: boolean;
        member: boolean
      }
    }) {
      const config = {
        params: payload?.query
      }
      return axiosStats.get('/vo', config)
    }
  },
  account: {
    getBalanceUser () {
      return axiosStats.get('/account/balance/user')
    },
    getBalanceVo (payload: {
      path: {
        vo_id : string;
      }
    }) {
      return axiosStats.get('/account/balance/vo/' + payload.path.vo_id)
    }
  }
}
