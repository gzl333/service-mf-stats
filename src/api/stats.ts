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
    },
    getMeteringStorage (payload: {
      query?: {
        page?: number;
        page_size?: number;
        service_id?: string;
        bucket_id?: string;
        date_start?: string;
        date_end?: string;
        user_id?: string;
        'as-admin'?: boolean;
        download?: boolean;
      }
    }) {
      const config = {
        params: payload?.query
      }
      return axiosStats.get('/metering/storage', config)
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
    },
    getVoListMembers (payload: { path: { id: string } }) {
      return axiosStats.get('/vo/' + payload.path.id + '/list-members')
    },
    getServerVo (payload: {
      path: { vo_id: string },
      query?: {
        page?: number;
        page_size?: number;
        service_id?: string
      }
    }) {
      const config = {
        params: payload?.query
      }
      return axiosStats.get('/server/vo/' + payload.path.vo_id, config)
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
  },
  order: {
    getOrder (payload?: {
      query?: {
        page?: number,
        page_size?: number,
        resource_type?: 'vm' | 'disk' | 'bucket',
        order_type?: 'new' | 'renewal' | 'upgrade' | 'downgrade',
        status?: 'paid' | 'unpaid' | 'cancelled' | 'refund',
        time_start?: string,
        time_end?: string,
        vo_id?: string
      }
    }) {
      const config = {
        params: payload?.query
      }
      return axiosStats.get('/order', config)
    },
    getOrderId (payload: {
      path: { id: string }
    }) {
      return axiosStats.get('/order/' + payload.path.id)
    }
  },
  storage: {
    getStorageService (payload?: {
      query?: {
        page?: number
        page_size?: number
        center_id?: string
        status?: ('enable' | 'disable' | 'deleted')[]
      }
    }) {
      const config = { params: payload?.query }
      return axiosStats.get('/storage/service', config)
    }
  },
  statement: {
    getStatementStorage (payload?: {
      query?: {
        page?: number;
        page_size?: number;
        payment_status?: string;
        date_start?: string;
        date_end?: string;
      }
    }) {
      const config = {
        params: payload?.query
      }
      return axiosStats.get('/statement/storage', config)
    },
    getStatementStorageDetail (payload: {
      path: { id: string }
    }) {
      return axiosStats.get('/statement/storage/' + payload.path.id)
    },
    getStatementServer (payload?: {
      query?: {
        page?: number;
        page_size?: number;
        payment_status?: string;
        date_start?: string;
        date_end?: string;
        vo_id?: string;
      }
    }) {
      const config = {
        params: payload?.query
      }
      return axiosStats.get('/statement/server', config)
    },
    getStatementServerDetail (payload: {
      path: {
        id: string;
      }
    }) {
      return axiosStats.get('/statement/server/' + payload.path.id)
    },
    getStatementServerInformation (payload: {
      path: {
        id: string;
      }
    }) {
      return axiosStats.get('/metering/server/' + payload.path.id)
    },
    getProjectGroupList (payload?: {
      query?: {
        page?: number;
        page_size?: number;
        member?: boolean;
      }
    }) {
      const config = {
        params: payload?.query
      }
      return axiosStats.get('/vo', config)
    }
  }
}
