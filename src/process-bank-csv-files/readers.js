function readCsvFileContent_(file) {
  return Utilities.parseCsv(file.getBlob().getDataAsString())
}
