function onOpen(e) {
  SpreadsheetApp.getUi()
    .createMenu("MinimumClics Menu")
    .addItem("Process Bank Files", "processBankCsvFiles")
    .addToUi();
}
