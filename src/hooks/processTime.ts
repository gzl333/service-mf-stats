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
  if (month > 5) {
    month = month - 5
    currentYear = year
  } else {
    currentYear = historyYear
    if (month - 5 === 0) {
      month = 12
    } else if (month - 5 === -1) {
      month = 11
    } else if (month - 5 === -2) {
      month = 10
    } else if (month - 5 === -3) {
      month = 9
    } else {
      month = 8
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
