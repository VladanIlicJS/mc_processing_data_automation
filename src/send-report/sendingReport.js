function sendProcessedBankCsvFilesReport_(processCount, rejectedCount) {
  const recipient = 'vladanilic017@gmail.com'
  const subject = 'Results'
  const body = `Processed files: ${processCount} \r\nRejected files: ${rejectedCount}`

  sendEmail_(recipient, subject, body)
}
