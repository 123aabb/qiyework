export function timeParse(val) {
  if (val == null || val === '') {
    return '暂无时间'
  } else {
    const d = new Date(val) // val 为表格内取到的后台时间
    const month =
        d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
    const day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
    const times = d.getFullYear() + '-' + month + '-' + day
    return times
  }
}
