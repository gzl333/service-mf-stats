const myDate = new Date()
const year = myDate.getFullYear()
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
