/* eslint-disable */
require('script-loader!file-saver')
require('script-loader!Blob')
// import Blob from '@/vendor/Blob'
import XLSX from 'xlsx'

function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook()
  this.SheetNames = []
  this.Sheets = {}
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length)
  var view = new Uint8Array(buf)
  for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
  return buf
}

function setHeader(ws, header) {
  const alphabet = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
  ]
  header.forEach(({ key, val }) => {
    for (let i = 0; i < alphabet.length; i++) {
      if (ws[alphabet[i] + 1].v && ws[alphabet[i] + 1].v === key) {
        ws[alphabet[i] + 1].v = val
        return
      }
    }
  })
  return ws
}

export function exportJson2Excel(jsonData, defaultTitle, sheetName, header) {
  var data = jsonData
  var wsName = sheetName || 'SheetJS'

  var wb = new Workbook()
  var ws = XLSX.utils.json_to_sheet(data)
  if (header && header.length) {
    ws = setHeader(ws, header)
  }
  /* add worksheet to workbook */
  wb.SheetNames.push(wsName)
  wb.Sheets[wsName] = ws
  var wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  })
  var title = defaultTitle || 'excel-list'
  saveAs(
    new Blob([s2ab(wbout)], {
      type: 'application/octet-stream'
    }),
    title + '.xlsx'
  )
}
