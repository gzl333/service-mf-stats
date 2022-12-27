// 将对应属性转换为用户可读的值
export function usePaymentStatusExpress () {
  return (status: string | undefined) => {
    if (status === 'paid') {
      return '已支付'
    } else if (status === 'unpaid') {
      return '未支付'
    } else if (status === 'canceled') {
      return '取消'
    }
  }
}
