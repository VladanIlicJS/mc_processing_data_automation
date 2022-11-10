function processBankCsvFiles() {
  const folder = new Drive(FOLDER_ID)
  const subfolders = folder.prepareSubfolders(SUBFOLDERS_NAMES)

  const sheetChecks = new Sheet('Checks')
  const sheetLogs = new Sheet('Logs')

  const fileCount = folder.numberOfFilesInsideFolder()

  sheetLogs.firstRowAppend(fileCount)

  const [data,processCount,rejectedCount]=processedDataAndResults_(folder,subfolders)

  sheetChecks.writeData(data)
  
  sheetLogs.lastRowAppend(processCount, rejectedCount)

  sendProcessedBankCsvFilesReport_(processCount,rejectedCount)
}
