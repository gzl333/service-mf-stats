// stats api

/* eslint-disable camelcase */

import { axiosStats } from 'boot/axios'
export const apiBaseHarbor = axiosStats.defaults.baseURL
export default {
  // stats apis
  api: {
    getUserPermissionPolicy (payload?: {
      query?: {
        page?: number;
        page_size?: number;
      }
    }) {
      const config = {
        params: payload?.query
      }
      return axiosStats.get('/user/permission-policy', config)
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
        'as-admin': boolean
      }
    }) {
      const config = {
        params: payload.query
      }
      return axiosStats.get('/metering/server/aggregation/server', config)
    },
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
        'as-admin': boolean
      }
    }) {
      const config = {
        params: payload.query
      }
      return axiosStats.get('/metering/server', config)
    }
  }
}
