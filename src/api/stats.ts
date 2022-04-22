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
    }
  }
}
