// en
export default {
  // 404
  出错了: 'Error',
  返回: 'Go Back',

  layout: {
    StatsLayout: {
      usage_billing: 'Usage & Billing',
      personal_server: 'Personal Server',
      group_server: 'Group Server',
      usage_management_statistics: 'Usage Management Statistics',
      release_time: 'Release Time'
    }
  },
  components: {
    group: {
      GroupTable: {
        my_role: 'My Role', // '我的角色',
        group: 'Group', // '所属组',
        org: 'Organisation', // 所属单位',
        remarks: 'Remarks', // '备注',
        creation_time: 'Creation Time', // '创建时间',
        members: 'Members', // '成员',
        server: 'Servers', // '云主机',
        order: 'Orders', // '订单',
        coupon: 'Vouchers', // '代金券',
        balance: 'Balance', // '余额',
        operation: 'Operation', // '操作',
        notify_loading: 'Requesting, please wait...', // '网络请求中，请稍候...',
        notify_no_group: 'No groups available', // '暂无项目组',
        notify_no_result: 'No search results', // '无搜索结果',
        details: 'Detail', // '详情',
        member: '', // '人',
        servers: '', // '台',
        orders: '', // '个',
        coupons: '', // '个',
        points: 'Points', //  '点',
        check_details: 'Detail', //  '查看详情',
        edit_group_info: 'Edit', // '编辑项目组',
        dismiss_group: 'Dismiss' // '解散项目组'
      },
      GroupRoleChip: {
        owner: 'Owner', // '组长',
        admin: 'Manager', // '管理员',
        member: 'Member' // '组员,'
      }
    },
    public: {
      ServerUsageTable: {
        ip: 'IP',
        service_unit: 'Service Unit',
        initial_configuration: 'Initial Configuration',
        public_ip: 'Public IP',
        local_disk: 'Local Disk',
        piece_days: '(piece * days)',
        core_day: '(core * day)',
        gb_days: '(GB * days)',
        billing_amount: 'Billing Amount',
        actual_deduction_amount: 'Actual Deduction Amount',
        network_request_in_progress_please_wait: 'Network request in progress, please wait...',
        core: 'Core',
        memory: 'Memory'
      },
      ServerStatisticsDetailTable: {
        payment_method: 'Payment Method',
        snapshot: 'snapshot',
        billing_date: 'Billing Date',
        deduction_status: 'Deduction Status',
        points: 'Points',
        group: 'Group',
        total_billing_amount: 'Total Billing Amount',
        total_amount_of_actual_deduction: 'Total Amount Of Actual Deduction'
      }
    }
  },
  pages: {
    personal: {
      CurrentMonthList: {
        export_current_page_data: 'Export Current Page Data',
        export_all_data: 'Export all data',
        filter_service: 'Filter Service',
        page: 'Page',
        no_data: 'No Data'
      },
      HistoryList: {
        search: 'Search',
        to: 'To',
        confirm: 'Confirm'
      },
      PersonalIndex: {
        personal_servers: 'Personal Servers',
        current_month_data: 'Current Month Data',
        last_month_data: 'Last Month Data',
        history_data: 'History Data'
      }
    },
    public: {
      ServerUsageDetailList: {
        servers_usage_details: 'Servers Usage Details',
        please_select: 'Please Select',
        public_ip: 'Public IP'
      }
    },
    group: {
      GroupIndex: {
        group_servers: 'Group Servers',
        group_list: 'Group List'
      },
      GroupList: {
        all_groups: 'All Groups',
        as_group_owner: 'As Group Owner',
        as_group_manager: 'As Group Manager',
        as_group_member: 'As Group Member',
        my_role_filter: 'My Role Filter'
      },
      GroupMeteringList: {
        go_back_to_group_list: 'Go Back To Group List'
      }
    },
    statistic: {
      cloud: {
        StatisticsIndex: {
          usage_management_statistics: 'Usage Management Statistics',
          servers: 'Servers',
          storage: 'Storage'
        },
        AggregationIndex: {
          by_servers_uuid: 'By Servers UUID',
          by_service_unit: 'By Service Unit',
          by_group_id: 'By Group ID',
          by_user_id: 'By User ID'
        },
        GroupAggregationList: {
          group_name: 'Group Name',
          company: 'Company',
          total_number_of_servers: 'Total Number Of Servers'
        },
        ServerAggregationList: {
          uuid: 'UUID',
          billing_amount: 'Billing Amount',
          actual_billing_amount: 'Actual Billing Amount',
          not_yet: 'Not Yet',
          copy_to_clipboard: 'Copy To Clipboard'
        },
        UserAggregationList: {
          user: 'User'
        },
        ServerUsageDetailList: {
          user: 'User',
          group: 'Group',
          service: 'Service',
          billing_cycle: 'Billing Cycle'
        }
      }
    }
  },
  hooks: {
    useCopyToClipboard: {
      content_copied_to_clipboard: 'Content copied to clipboard',
      copied_to_clipboard: 'Copied to clipboard'
    }
  }
}
