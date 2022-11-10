function sendEmail_(recipient, subject, body) {
  if (environment.createDraft) {
    GmailApp.createDraft(recipient, subject, body)
  } else {
    GmailApp.sendEmail(recipient, subject, body)
  }
}
