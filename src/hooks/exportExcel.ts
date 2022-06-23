import XLSX from 'xlsx'
import FileSaver from 'file-saver'

export const exportExcel = (name: string, id: string) => {
  // name表示生成excel的文件名     tableName表示表格的id
  const sel = XLSX.utils.table_to_book(document.querySelector(id))
  const selIn = XLSX.write(sel, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'array'
  })
  try {
    FileSaver.saveAs(new Blob([selIn], { type: 'application/octet-stream' }), name)
  } catch (e) {
    if (typeof console !== 'undefined') console.log(e, selIn)
  }
  return selIn
}

export const exportAllData = (fileData: Record<string, unknown>, fileName: string) => {
  // 创建一个a标签
  const link = document.createElement('a')
  // 转化为blob对象
  // csv文件流需要加上\ufeff前缀,否则会乱码
  const blob = new Blob(['\ufeff' + fileData], { type: 'text/csv,charset=UTF-8' })
  link.style.display = 'none'
  link.href = URL.createObjectURL(blob)
  // link.download = fileData.headers['content-disposition']
  // 文件名
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
