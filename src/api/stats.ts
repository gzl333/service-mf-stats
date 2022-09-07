// stats api

/* eslint-disable camelcase */

import { axiosStats } from 'boot/axios'
export const apiBaseHarbor = axiosStats.defaults.baseURL
export default {
  // stats apis
  registry: {
    getRegistry () {
      return axiosStats.get('/registry')
    }
  },
  user: {
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
    }
  },
  service: {
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
    }
  },
  metering: {
    getMeteringServer (payload: {
      query: {
        page?: number;
        page_size?: number;
        service_id?: string;
        server_id?: string;
        date_start?: string;
        date_end?: string;
        vo_id?: string;
        user_id?: string;
        'as-admin'?: boolean;
        download?: boolean
      }
    }) {
      const config = {
        params: payload.query
      }
      return axiosStats.get('/metering/server', config)
    },
    getAggregationServer (payload: {
      query: {
        page?: number;
        page_size?: number;
        date_start?: string;
        date_end?: string;
        vo_id?: string;
        user_id?: string;
        service_id?: string;
        'as-admin'?: boolean;
        download?: boolean
      }
    }) {
      const config = {
        params: payload.query
      }
      return axiosStats.get('/metering/server/aggregation/server', config)
    },
    getAggregationService (payload: {
      query: {
        page?: number;
        page_size?: number;
        date_start?: string;
        date_end?: string;
        'as-admin'?: boolean;
        download?: boolean
      }
    }) {
      const config = {
        params: payload.query
      }
      return axiosStats.get('/metering/server/aggregation/service', config)
    },
    getAggregationUser (payload: {
      query: {
        page?: number;
        page_size?: number;
        date_start?: string;
        date_end?: string;
        service_id?: string;
        'as-admin'?: boolean;
        download?: boolean;
      }
    }) {
      const config = {
        params: payload.query
      }
      return axiosStats.get('/metering/server/aggregation/user', config)
    },
    getAggregationVo (payload: {
      query: {
        page?: number;
        page_size?: number;
        date_start?: string;
        date_end?: string;
        service_id?: string;
        'as-admin'?: boolean;
        download?: boolean;
      }
    }) {
      const config = {
        params: payload.query
      }
      return axiosStats.get('/metering/server/aggregation/vo', config)
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
  },
  cashcoupon: {
    getCashCoupon (payload?: {
      query?: {
        page?: number;
        page_size?: number;
        vo_id?: string;
        available?: string
      }
    }) {
      const config = {
        params: payload?.query
      }
      return axiosStats.get('/cashcoupon', config)
    }
  }
}
