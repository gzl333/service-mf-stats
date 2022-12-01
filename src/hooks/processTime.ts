const myDate = new Date()
const year = myDate.getFullYear()
const historyYear = myDate.getFullYear() - 1
let month: number | string = myDate.getMonth() + 1
let strDate: number | string = myDate.getDate()
export const getNowFormatDate = (type: number) => {
  month = myDate.getMonth() + 1
  strDate = myDate.getDate()
  const seperator1 = '-'
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  if (type === 0) {
    return year + seperator1 + month + seperator1 + '01'
  } else {
    return year + seperator1 + month + seperator1 + strDate
  }
}
export const getLastFormatDate = (type: number) => {
  month = myDate.getMonth()
  strDate = myDate.getDate()
  const day = new Date(year, month, 0).getDate()
  const seperator1 = '-'
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  if (type === 0) {
    return year + seperator1 + month + seperator1 + '01'
  } else {
    return year + seperator1 + month + seperator1 + day
  }
}
export const getFormatDate = () => {
  let currentMonth: number | string = myDate.getMonth() + 1
  let strDate: number | string = myDate.getDate()
  const seperator1 = '-'
  if (currentMonth >= 1 && currentMonth <= 9) {
    currentMonth = '0' + currentMonth
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  return year + seperator1 + currentMonth + seperator1 + strDate
}
export const getHistoryStartFormatDate = () => {
  month = myDate.getMonth() + 1
  strDate = myDate.getDate()
  let currentYear
  const seperator1 = '-'
  if (month > 3) {
    month = month - 3
    currentYear = year
  } else {
    currentYear = historyYear
    if (month - 3 === 0) {
      month = 12
    } else if (month - 3 === -1) {
      month = 11
    } else {
      month = 10
    }
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  if (month <= 9) {
    month = '0' + month
    return currentYear + seperator1 + month + seperator1 + '01'
  } else {
    return currentYear + seperator1 + month + seperator1 + '01'
  }
}
export const dateFormat = (row: string) => {
  const date = new Date(row)
  const year = date.getFullYear()
  const month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : '' + (date.getMonth() + 1)
  const day = date.getDate() < 10 ? '0' + date.getDate() : '' + date.getDate()
  const hour = date.getHours() < 10 ? '0' + date.getHours() : '' + date.getHours()
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : '' + date.getMinutes()
  const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : '' + date.getSeconds()
  return (year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds)
}
export function payRecordUtcToBeijing (utcDatetime: string) {
  // 转为正常的时间格式 年-月-日 时:分:秒
  const newDateTime = utcDatetime.split('T')[0] + ' ' + utcDatetime.split('T')[1].split('.')[0]
  // 处理成为时间戳
  let timeStamp = new Date(newDateTime.replace(/-/g, '/')).getTime()
  timeStamp = timeStamp / 1000
  // 增加8个小时，北京时间比utc时间多八个时区
  timeStamp = timeStamp + 8 * 60 * 60
  const Timestamp = timeStamp.toString()
  // 时间戳转为时间
  const dateTime = new Date(parseInt(Timestamp) * 1000)
  const YY = dateTime.getFullYear() + '-'
  const MM = (dateTime.getMonth() + 1 < 10 ? '0' + (dateTime.getMonth() + 1) : dateTime.getMonth() + 1) + '-'
  const DD = (dateTime.getDate() < 10 ? '0' + (dateTime.getDate()) : dateTime.getDate())
  const hh = (dateTime.getHours() < 10 ? '0' + dateTime.getHours() : dateTime.getHours()) + ':'
  const mm = (dateTime.getMinutes() < 10 ? '0' + dateTime.getMinutes() : dateTime.getMinutes()) + ':'
  const ss = (dateTime.getSeconds() < 10 ? '0' + dateTime.getSeconds() : dateTime.getSeconds())
  return YY + MM + DD + 'T' + hh + mm + ss + 'Z'
}

export function serverPayRecordUtcToBeijing (utcDateTime: string) {
  // 转为正常的时间格式 年-月-日 时:分:秒
  const newDateTime = utcDateTime.split('T')[0] + ' ' + utcDateTime.split('T')[1].split('.')[0]
  // 处理成为时间戳
  let timestamp = new Date(newDateTime.replace(/-/g, '/')).getTime()
  timestamp = timestamp / 1000
  // 增加8个小时，北京时间比utc时间多八个时区
  timestamp = timestamp + 8 * 60 * 60
  const Timestamp = timestamp.toString()
  // 时间戳转为时间
  const date = new Date(parseInt(Timestamp) * 1000)
  const YY = date.getFullYear() + '-'
  const MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
  const hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  const mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  const ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  return YY + MM + DD + ' ' + hh + mm + ss
}

export function numberPayRecordUtcToBeijing (utcDateTime: string) {
  // 转为正常的时间格式 年-月-日 时:分:秒
  const newDateTime = utcDateTime.split('T')[0] + ' ' + utcDateTime.split('T')[1].split('.')[0]
  // 处理成为时间戳
  let timestamp = new Date(newDateTime.replace(/-/g, '/')).getTime()
  timestamp = timestamp / 1000
  // 增加8个小时，北京时间比utc时间多八个时区
  timestamp = timestamp + 8 * 60 * 60
  const Timestamp = timestamp.toString()
  // 时间戳转为时间
  const date = new Date(parseInt(Timestamp) * 1000)
  const YY = date.getFullYear()
  const MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + ''
  const DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
  const hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours())
  const mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
  const ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  return YY + MM + DD + hh + mm + ss
}
