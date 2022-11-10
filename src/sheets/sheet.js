class Sheet {
  constructor(name) {
    this.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name)
  }
  writeData(fileContent) {
    console.log(fileContent)
    this.sheet.getRange(this.sheet.getLastRow() + 1, 1, fileContent.length, fileContent[0].length).setValues(fileContent)
  }
  firstRowAppend(fileCount) {
    this.sheet.appendRow([new Date(), 'Files processing started', `Files found ${fileCount}`])
  }
  lastRowAppend(pF, rF) {
    this.sheet.appendRow([new Date(), 'Files processing ended', `successful files processed:${pF} Failure files:${rF}`])
  }
  logFileInfo(fileName, success = 'True', errors = '') {
    const array = errors ? `${errors.length > 1 ? `Columns ${errors.map(error => `${error}`)} not found` : `Column ${errors[0]} not found`}` : ''

    const row = [new Date(), 'Processing file', fileName, success, array]

    this.sheet.appendRow(row)
  }
  //(sheetLogs,fileName,"FALSE",`${errors.length>1 ? `Columns ${errors.map(error=>`${error }`)} not found`: `Column ${errors[0]} not found`}`)
}
