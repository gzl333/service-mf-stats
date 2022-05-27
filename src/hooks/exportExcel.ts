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
