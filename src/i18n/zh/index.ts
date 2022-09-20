// zh
export default {
  layout: {
    StatsLayout: {
      usage_billing: '用量账单',
      personal_server: '个人云主机',
      group_server: '项目组云主机',
      usage_management_statistics: '用量管理统计',
      release_time: '发布时间'
    }
  },
  components: {
    group: {
      GroupTable: {
        my_role: '我的角色',
        group: '所属组',
        org: '所属单位',
        remarks: '备注',
        creation_time: '创建时间',
        members: '成员',
        server: '云主机',
        order: '订单',
        coupon: '代金券',
        balance: '余额',
        operation: '操作',
        notify_loading: '网络请求中，请稍候...',
        notify_no_group: '暂无项目组',
        notify_no_result: '无搜索结果',
        details: '详情',
        member: '人',
        servers: '台',
        orders: '个',
        coupons: '个',
        points: '点',
        check_details: '查看详情',
        edit_group_info: '编辑项目组',
        dismiss_group: '解散项目组'
      },
      GroupRoleChip: {
        owner: '组长',
        admin: '管理员',
        member: '组员'
      }
    },
    public: {
      ServerUsageTable: {
        ip: 'IP地址',
        service_unit: '服务单元',
        initial_configuration: '初始配置',
        public_ip: '公网IP',
        local_disk: '本地硬盘',
        piece_days: '(个*天)',
        core_day: '(核*天)',
        gb_days: '(GB*天)',
        billing_amount: '计费金额',
        actual_deduction_amount: '实际扣费金额',
        network_request_in_progress_please_wait: '网络请求中，请稍候...',
        core: '核',
        memory: '内存'
      },
      ServerStatisticsDetailTable: {
        payment_method: '支付方式',
        snapshot: '快照',
        billing_date: '计费日期',
        deduction_status: '扣费状态',
        points: '点',
        group: '项目组',
        total_billing_amount: '计费金额合计',
        total_amount_of_actual_deduction: '实际扣费金额合计'
      }
    }
  },
  pages: {
    personal: {
      CurrentMonthList: {
        export_current_page_data: '导出当页数据',
        export_all_data: '导出全部数据',
        filter_service: '筛选服务',
        page: '页',
        no_data: '暂无数据'
      },
      HistoryList: {
        search: '搜索',
        to: '至',
        confirm: '确定'
      },
      PersonalIndex: {
        personal_servers: '个人云主机',
        current_month_data: '本月数据',
        last_month_data: '上月数据',
        history_data: '历史数据'
      }
    },
    public: {
      ServerUsageDetailList: {
        servers_usage_details: '云主机用量详情',
        please_select: '请选择',
        public_ip: '公网IP'
      }
    },
    group: {
      GroupIndex: {
        group_servers: '项目组云主机',
        group_list: '项目组列表'
      },
      GroupList: {
        all_groups: '全部项目组',
        as_group_owner: '作为组长',
        as_group_manager: '作为管理员',
        as_group_member: '作为组员',
        my_role_filter: '筛选我的角色'
      },
      GroupMeteringList: {
        go_back_to_group_list: '返回项目组列表'
      }
    },
    statistic: {
      cloud: {
        StatisticsIndex: {
          usage_management_statistics: '用量管理统计',
          servers: '云主机',
          storage: '对象存储'
        },
        AggregationIndex: {
          by_servers_uuid: '按云主机uuid',
          by_service_unit: '按服务单元',
          by_group_id: '按项目组id',
          by_user_id: '按用户id'
        },
        GroupAggregationList: {
          group_name: '项目组名称',
          company: '单位',
          total_number_of_servers: '云主机数量合计'
        },
        ServerAggregationList: {
          uuid: '云主机uuid',
          billing_amount: '计费金额(总)',
          actual_billing_amount: '实际扣费金额(总)',
          not_yet: '暂无',
          copy_to_clipboard: '复制到剪切板'
        },
        UserAggregationList: {
          user: '用户'
        },
        ServerUsageDetailList: {
          user: '用户名',
          group: '组名称',
          service: '服务名称',
          billing_cycle: '计费周期'
        }
      }
    }
  },
  hooks: {
    useCopyToClipboard: {
      content_copied_to_clipboard: '内容已经复制到剪切板',
      copied_to_clipboard: '已经复制到剪切板'
    }
  }
}
