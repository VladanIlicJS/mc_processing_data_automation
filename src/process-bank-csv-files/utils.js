function processedDataAndResults(folder,subfolders){
  const fileIter = folder.folder.getFiles()
  let processCount=0
  let rejectedCount=0
  let fullDataPrepareForWriting=[]
  while (fileIter.hasNext()) {
    const file = fileIter.next()
    const fileName = file.getName()
    const fileContent = readCsvFileContent_(file)

    let newFileContent = extractData_(fileContent, fileName)
    
    if (newFileContent) {
      newFileContent.shift()

      newFileContent = isChecked(newFileContent)

      if (newFileContent.length > 0) {
        newFileContent.map(row=>fullDataPrepareForWriting.push(row))
      }
      processCount++
      if (environment.moveToProcessed) {
        file.moveTo(subfolders[SUBFOLDERS_NAMES.PROCESSED_FOLDER_NAME])
      }
    } else {
      rejectedCount++
      if (environment.moveToRejected) {
        file.moveTo(subfolders[SUBFOLDERS_NAMES.REJECTED_FOLDER_NAME])
      }
    }
  }
  return [fullDataPrepareForWriting,processCount,rejectedCount]
}





function compareHeaders(EXPECTED_HEADER,headerFromFile){
  let errors=[]
  let array=[]
  array= EXPECTED_HEADER.map(header=>{
    if(headerFromFile.includes(header)){
      return true
    }else{
      errors.push(header)
      return false
    }
  })
  return [array,errors]
}
  
function returnRightBankHeader(bankName){
  if(bankName=='Intesa'){
    return INTESA_HEADER
  }
  if(bankName=='OTP'){
    return OTP_HEADER
  }
  if(bankName=='Kombank'){
    return KOMBANK_HEADER
  }
  if(bankName=='Unicredit'){
    return UNICREDIT_HEADER
  }
}


