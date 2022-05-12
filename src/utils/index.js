export function export2Excel (columns, list) {
  require.ensure([], () => {
    // eslint-disable-next-line camelcase
    const { export_json_to_excel } = require('./Export2Excel')
    const tHeader = []
    const filterVal = []
    columns.forEach(item => {
      tHeader.push(item.title)
      filterVal.push(item.key)
    })
    const data = list.map(v => filterVal.map(j => v[j]))
    export_json_to_excel(tHeader, data, '数据列表')
  })
}
